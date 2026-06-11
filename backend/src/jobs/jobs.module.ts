import { Module } from '@nestjs/common';
import { MediaProcessorWorker } from './consumers/media-processor.worker';
@Module({providers:[MediaProcessorWorker]})
export class JobsModule {}
