// write test for video controller
// Path: src\videos\video.controller.spec.ts
// Compare this snippet from src\videos\video.controller.spec.ts:

import { Test } from '@nestjs/testing';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Videos } from './entities/video.entity';
import { Users } from '../user/entities/user.entity';
import { VideoGateway } from './video.gateway';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../../db/data-source';
import { PaginateQuery, Paginated } from 'nestjs-paginate';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';

describe('VideoService', () => {
  let videoController: VideoController;
  let videoService: VideoService;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Videos, Users]),
        TypeOrmModule.forRoot(dataSourceOptions),
      ],
      controllers: [VideoController],
      providers: [
        VideoService,
        VideoGateway,
        AuthService,
        UserService,
        JwtService,
      ],
    }).compile();

    videoController = moduleRef.get<VideoController>(VideoController);
    videoService = moduleRef.get<VideoService>(VideoService);
    userService = moduleRef.get<UserService>(UserService);
  });

  describe('Youtube Service', () => {
    it('get id from youtube url', async () => {
      const result = await videoService.getIdFromUrl(
        'https://www.youtube.com/watch?v=3jWRrafhO7M',
      );
      expect(result).toBe('3jWRrafhO7M');
    });

    it('get youtube data', async () => {
      axios.get = jest.fn().mockResolvedValue({
        data: {
          items: [
            {
              snippet: {
                title:
                  '#GhibliJazz #CafeMusic - Relaxing Jazz & Bossa Nova Music - Studio Ghibli Cover',
                description:
                  '🖤본 채널은 수익 창출을 하지 않습니다\n' +
                  '🖤instagram @iburgeryou__\n' +
                  '\n' +
                  '\n' +
                  '\n' +
                  '\n' +
                  '#외힙 #힙합플레이리스트 #운동할때듣는노래  #외힙플레이리스트  #빵댕이',
                url: 'https://www.youtube.com/watch?v=3jWRrafhO7M',
              },
            },
          ],
        },
      });
      const result = await videoService.getDataFromUrl(
        'https://www.youtube.com/watch?v=3jWRrafhO7M',
      );
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('url');
      expect(result.title).toBe(
        '#GhibliJazz #CafeMusic - Relaxing Jazz & Bossa Nova Music - Studio Ghibli Cover',
      );
    });

    it('get youtube data with wrong url', async () => {
      axios.get = jest.fn().mockResolvedValue({
        data: {
          items: [],
        },
      });
      expect(
        videoService.getDataFromUrl(
          'https://www.youtube.com/2462346342512451234',
        ),
      ).rejects.toThrow(new BadRequestException('Wrong youtube url'));
    });
  });
});
