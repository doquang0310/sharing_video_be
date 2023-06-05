import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { Videos } from './entities/video.entity';
import { createVideoByUrlDto, createVideoDto } from './dto/video.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';

@Controller('videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @UseGuards(AuthGuard)
  @Post('/')
  async create(@Body() body: createVideoByUrlDto): Promise<Videos> {
    const id = await this.videoService.getIdFromUrl(body.url);

    if (!id) {
      throw new BadRequestException('Wrong url');
    }

    const data = await this.videoService.getDataFromUrl(id);

    const video = await this.videoService.create(data);

    return video;
  }

  @Get()
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Videos>> {
    return this.videoService.findAll(query);
  }
}
