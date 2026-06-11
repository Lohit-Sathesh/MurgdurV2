import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { SearchModule } from './search/search.module';
import { OrdersModule } from './orders/orders.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { DatabaseModule } from './database/database.module';
import { MediaModule } from './media/media.module';
import { JobsModule } from './jobs/jobs.module';
@Module({imports:[ConfigModule.forRoot({isGlobal:true}),DatabaseModule,AuthModule,UsersModule,ProductsModule,SearchModule,OrdersModule,WishlistModule,MediaModule,JobsModule]})
export class AppModule {}
