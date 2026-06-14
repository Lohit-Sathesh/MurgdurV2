import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../database/prisma.service'
import { EmailService } from '../email/email.service'
import { InvoiceService } from '../email/invoice.service'
import { CreateOrderDto } from './dto/create-order.dto'

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private email: EmailService,
    private invoice: InvoiceService,
  ) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    const orderNumber = `MRG-ORD-${Date.now()}`

    const items = await Promise.all(dto.items.map(async item => {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
        include: { images: { take: 1 } }
      })
      const variant = item.variantId
        ? await this.prisma.productVariant.findUnique({ where: { id: item.variantId } })
        : null
      const unitPrice = Number(variant?.price ?? product?.price ?? 0)
      return {
        productId: item.productId,
        variantId: item.variantId ?? null,
        quantity: item.quantity,
        unitPrice,
        totalPrice: unitPrice * item.quantity,
        snapshot: { name: product?.name, image: product?.images?.[0]?.url },
      }
    }))

    const subtotal = items.reduce((s, i) => s + i.totalPrice, 0)
    const tax = subtotal * 0.18
    const total = subtotal + tax

    const order = await this.prisma.$transaction(async tx => {
      for (const item of items) {
        if (!item.variantId) continue
        const variant = await tx.productVariant.findUnique({ where: { id: item.variantId } })
        if (!variant || variant.stock < item.quantity) {
          throw new BadRequestException(`Insufficient stock for ${item.snapshot.name ?? 'item'}`)
        }
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        })
      }

      return tx.order.create({
        data: {
          orderNumber,
          userId,
          addressId: dto.addressId,
          subtotal,
          tax,
          total,
          paymentMethod: dto.paymentMethod,
          items: { create: items },
        },
        include: { items: true }
      })
    })

    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } })
      if (user) {
        await this.email.sendOrderConfirmation(
          user.email,
          user.firstName,
          order.orderNumber,
          items.map(i => ({ productName: i.snapshot.name, quantity: i.quantity, price: i.unitPrice })),
          total,
        )
        const pdf = await this.invoice.generateInvoicePdf(order.id)
        await this.email.sendInvoice(user.email, user.firstName, order.orderNumber, pdf)
      }
    } catch {}

    return order
  }

  async cancelOrder(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: true }
    })
    if (!order) throw new NotFoundException('Order not found')
    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      throw new BadRequestException('Order can no longer be cancelled')
    }

    return this.prisma.$transaction(async tx => {
      for (const item of order.items) {
        if (!item.variantId) continue
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { increment: item.quantity } },
        })
      }
      return tx.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
        include: { items: true }
      })
    })
  }

  async getOrderHistory(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    })
  }

  async getOrder(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: true, address: true }
    })
    if (!order) throw new NotFoundException('Order not found')
    return order
  }

  async updatePaymentStatus(orderId: string, paymentStatus: string, paymentRef?: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: paymentStatus as any, paymentRef }
    })
  }
}