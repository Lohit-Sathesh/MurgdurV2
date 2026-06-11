import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
@Injectable()
export class WishlistService{constructor(private readonly prisma:PrismaService){} list(userId:string){return this.prisma.wishlist.findMany({where:{userId},include:{product:true}})} add(userId:string,productId:string){return this.prisma.wishlist.create({data:{userId,productId}})} remove(id:string){return this.prisma.wishlist.delete({where:{id}})}}
