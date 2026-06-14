import { Controller, Post, Get, Delete, UploadedFiles, UploadedFile, UseGuards, UseInterceptors, Body, Param, Query } from '@nestjs/common'
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { AdminGuard } from '../common/guards/admin.guard'
import { MediaService } from './media.service'

@Controller('media')
@UseGuards(JwtAuthGuard, AdminGuard)
export class MediaController {
  constructor(private media: MediaService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 10))
  upload(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('sku') sku: string,
  ) {
    return this.media.uploadProductImages(files, sku)
  }

  @Post('upload-homepage')
  @UseInterceptors(FileInterceptor('file'))
  uploadHomepage(@UploadedFile() file: Express.Multer.File) {
    return this.media.uploadHomepageMedia(file)
  }

  @Get('images')
  getImages(@Query('sku') sku: string) {
    return this.media.getProductImages(sku)
  }

  @Delete('images/:imageId')
  deleteImage(@Param('imageId') imageId: string, @Query('sku') sku: string) {
    return this.media.deleteProductImage(sku, imageId)
  }
}
