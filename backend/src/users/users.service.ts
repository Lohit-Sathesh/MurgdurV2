import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../database/prisma.service';
@Injectable()
export class UsersService{constructor(private readonly prisma:PrismaService){} generateCustomerId(){return `MRG-${randomUUID().slice(0,8).toUpperCase()}`} getProfile(email:string){return this.prisma.user.findUnique({where:{email},include:{addresses:true}})} updateProfile(email:string,data:{name?:string}){return this.prisma.user.update({where:{email},data})}}
