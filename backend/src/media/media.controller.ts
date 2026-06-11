import { Body, Controller, Post } from '@nestjs/common';
import { MediaService } from './media.service';
@Controller('media')
export class MediaController{constructor(private readonly mediaService:MediaService){} @Post('signed-upload') signedUpload(@Body() body:{filename:string}){return this.mediaService.createUploadTarget(body.filename)}}
