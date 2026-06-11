import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
@Controller('orders')
export class OrdersController{constructor(private readonly ordersService:OrdersService){} @Post() create(@Body() body:{userId:string;items:Array<{productId:string;quantity:number;price:number}>}){return this.ordersService.createOrder(body.userId,body.items)} @Get('history') history(){return this.ordersService.getOrderHistory('demo-user')} @Patch('payment') payment(@Body() body:{orderId:string;paymentStatus:string}){return this.ordersService.updatePaymentStatus(body.orderId,body.paymentStatus)}}
