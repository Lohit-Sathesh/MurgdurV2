import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { SearchService } from '../search/search.service';
import { CreateProductDto } from './dto/create-product.dto';
@Injectable()
export class ProductsService{constructor(private readonly prisma:PrismaService,private readonly search:SearchService){} categories(){return this.prisma.product.findMany({distinct:['category'],select:{category:true}})} async create(dto:CreateProductDto){const product=await this.prisma.product.create({data:{...dto,media:dto.media||[]}});await this.search.syncProduct(product);return product}}
