import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoEntity } from './entities/video.entity';
import { createVideoByUrlDto, createVideoDto } from './dto/video.dto';

@Controller()
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post()
  async create(@Body() body: createVideoByUrlDto): Promise<VideoEntity> {
    const id = await this.videoService.getIdFromUrl(body.url);

    if (!id) {
      throw new BadRequestException('Wrong url');
    }

    const data = await this.videoService.getDataFromUrl(id);

    const video = await this.videoService.createVideo(data);

    return video;
  }
}
