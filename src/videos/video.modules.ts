import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Videos } from './entities/video.entity';
import { VideoGateway } from './video.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Videos])
  ],
  controllers: [VideoController],
  providers: [VideoService,VideoGateway],
})
export class VideoModule {}
