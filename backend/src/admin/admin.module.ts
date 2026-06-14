import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SearchModule } from '../search/search.module';
import { AdminController } from './admin.controller';

@Module({
  imports: [DatabaseModule, SearchModule],
  controllers: [AdminController],
})
export class AdminModule {}
