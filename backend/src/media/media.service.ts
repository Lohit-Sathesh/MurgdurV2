import { Injectable } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
@Injectable()
export class MediaService{private s3=new S3Client({region:'auto',endpoint:process.env.R2_ENDPOINT,credentials:{accessKeyId:process.env.R2_ACCESS_KEY_ID||'',secretAccessKey:process.env.R2_SECRET_ACCESS_KEY||''}}); createUploadTarget(filename:string){void this.s3;return {bucket:process.env.R2_BUCKET,key:`uploads/${Date.now()}-${filename}`}}}
