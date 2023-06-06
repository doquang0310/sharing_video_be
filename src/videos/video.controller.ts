import {
  BadRequestException,
  Body,
  Headers,
  Controller,
  Get,
  Post,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { Videos } from './entities/video.entity';
import { createVideoByUrlDto, createVideoDto } from './dto/video.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { UserService } from 'src/user/user.service';
import { DecodeJwt } from 'src/auth/auth.type';
import { AuthService } from 'src/auth/auth.service';

@Controller('videos')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('/')
  async create(
    @Headers('Authorization') auth: string,
    @Body() body: createVideoByUrlDto,
  ): Promise<Videos> {
    const id = await this.videoService.getIdFromUrl(body.url);
    const authDecode: DecodeJwt = this.authService.decodeAuthToken(auth) as any;

    const publishedBy = await this.userService.findOneByEmail(authDecode.email);

    if (!publishedBy) {
      throw new UnauthorizedException();
    }

    if (!id) {
      throw new BadRequestException('Wrong url');
    }

    const data = await this.videoService.getDataFromUrl(id);

    const video = await this.videoService.create({ ...data, publishedBy });

    return video;
  }

  @Get()
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Videos>> {
    return this.videoService.findAll(query);
  }
}
