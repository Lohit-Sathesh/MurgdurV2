import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
@Controller('wishlist')
export class WishlistController{constructor(private readonly wishlistService:WishlistService){} @Get() list(){return this.wishlistService.list('demo-user')} @Post() add(@Body() body:{productId:string}){return this.wishlistService.add('demo-user',body.productId)} @Delete(':id') remove(@Param('id') id:string){return this.wishlistService.remove(id)}}
