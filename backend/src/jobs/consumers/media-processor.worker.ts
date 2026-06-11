import { Injectable, Logger } from '@nestjs/common';
@Injectable()
export class MediaProcessorWorker{private readonly logger=new Logger(MediaProcessorWorker.name); process(assetKey:string){this.logger.log(`Processing media asset ${assetKey}`);return {assetKey,status:'queued'}}}
