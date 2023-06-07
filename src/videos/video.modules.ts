import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Videos } from './entities/video.entity';
import { VideoGateway } from './video.gateway';
import { UserService } from '../user/user.service';
import { Users } from '../user/entities/user.entity';
import { AuthService } from '../auth/auth.service';
@Module({
  imports: [TypeOrmModule.forFeature([Videos, Users])],
  controllers: [VideoController],
  providers: [VideoService, VideoGateway, AuthService, UserService],
})
export class VideoModule {}
