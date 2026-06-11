import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RedisService } from './redis.service';

@Module({ providers: [PrismaService, RedisService], exports: [PrismaService, RedisService] })
export class DatabaseModule {}
