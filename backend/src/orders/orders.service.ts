import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
@Injectable()
export class OrdersService{constructor(private readonly prisma:PrismaService){} createOrder(userId:string,items:Array<{productId:string;quantity:number;price:number}>){return this.prisma.order.create({data:{userId,items:{create:items}},include:{items:true}})} updatePaymentStatus(orderId:string,paymentStatus:string){return this.prisma.order.update({where:{id:orderId},data:{paymentStatus}})} getOrderHistory(userId:string){return this.prisma.order.findMany({where:{userId},include:{items:true},orderBy:{createdAt:'desc'}})}}
