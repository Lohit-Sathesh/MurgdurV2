import { Controller, Post, Body, UseGuards, Req, Headers, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { PaymentService } from './payment.service'
import { OrdersService } from '../orders/orders.service'

@Controller('payments/razorpay')
export class PaymentController {
  constructor(
    private payments: PaymentService,
    private orders: OrdersService,
    private config: ConfigService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('order')
  async createOrder(@Req() req: any, @Body() body: { orderId: string }) {
    const order = await this.orders.getOrder(req.user.id, body.orderId)
    const amountInPaise = Math.round(Number(order.total) * 100)
    const razorpayOrder = await this.payments.createOrder(amountInPaise, req.user.id, order.id, req.user.email)
    return { ...razorpayOrder, keyId: this.config.get('RAZORPAY_KEY_ID') }
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify')
  async verify(@Req() req: any, @Body() body: {
    orderId: string
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
  }) {
    const valid = this.payments.verifyPaymentSignature(
      body.razorpay_order_id,
      body.razorpay_payment_id,
      body.razorpay_signature,
    )
    if (!valid) throw new BadRequestException('Invalid payment signature')

    await this.orders.getOrder(req.user.id, body.orderId)
    await this.orders.updatePaymentStatus(body.orderId, 'PAID', body.razorpay_payment_id)
    return { success: true }
  }

  @Post('webhook')
  async webhook(@Req() req: any, @Headers('x-razorpay-signature') signature: string) {
    const valid = this.payments.verifyWebhookSignature(req.rawBody?.toString() ?? '', signature)
    if (!valid) throw new BadRequestException('Invalid webhook signature')

    const event = req.body
    const orderId = event?.payload?.payment?.entity?.notes?.orderId
    if (orderId) {
      if (event.event === 'payment.captured') {
        await this.orders.updatePaymentStatus(orderId, 'PAID', event.payload.payment.entity.id)
      } else if (event.event === 'payment.failed') {
        await this.orders.updatePaymentStatus(orderId, 'FAILED')
      }
    }
    return { received: true }
  }
}
