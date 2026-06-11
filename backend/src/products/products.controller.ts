import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
@Controller('products')
export class ProductsController{constructor(private readonly productsService:ProductsService){} @Get('categories') categories(){return this.productsService.categories()} @Post() create(@Body() dto:CreateProductDto){return this.productsService.create(dto)}}
