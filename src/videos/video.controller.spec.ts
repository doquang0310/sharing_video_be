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
import { INestApplication, UnauthorizedException } from '@nestjs/common';
import * as io from 'socket.io-client';

describe('VideoController', () => {
  let videoController: VideoController;
  let videoService: VideoService;
  let userService: UserService;
  let app: INestApplication;

  function getSocketDsn() {
    const { port } = app.getHttpServer().listen().address();
    return `http://localhost:${port}`;
  }
  
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

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('findAll', () => {
    it('should return an array of videos', async () => {
      const result = {
        data: [
          {
            id: 94,
            url: 'https://www.youtube.com/embed/WGPsAQSdU2g',
            title: '[외힙] 목걸이는 무겁게, 방아쇠는 가볍게',
            description:
              '🖤본 채널은 수익 창출을 하지 않습니다\n🖤instagram @iburgeryou__\n\n\n\n\n#외힙 #힙합플레이리스트 #운동할때듣는노래  #외힙플레이리스트  #빵댕이',
            up_vote: 0,
            down_vote: 0,
            createdDate: new Date(),
            publishedBy: {
              id: 1,
              email: 'doquang0310@gmail.com',
              createdDate: new Date(),
            },
          },
          {
            id: 94,
            url: 'https://www.youtube.com/embed/WGPsAQSdU2g',
            title: '[외힙] 목걸이는 무겁게, 방아쇠는 가볍게',
            description:
              '🖤본 채널은 수익 창출을 하지 않습니다\n🖤instagram @iburgeryou__\n\n\n\n\n#외힙 #힙합플레이리스트 #운동할때듣는노래  #외힙플레이리스트  #빵댕이',
            up_vote: 0,
            down_vote: 0,
            createdDate: new Date(),
            publishedBy: {
              id: 1,
              email: 'doquang0310@gmail.com',
              createdDate: new Date(),
            },
          },
          {
            id: 94,
            url: 'https://www.youtube.com/embed/WGPsAQSdU2g',
            title: '[외힙] 목걸이는 무겁게, 방아쇠는 가볍게',
            description:
              '🖤본 채널은 수익 창출을 하지 않습니다\n🖤instagram @iburgeryou__\n\n\n\n\n#외힙 #힙합플레이리스트 #운동할때듣는노래  #외힙플레이리스트  #빵댕이',
            up_vote: 0,
            down_vote: 0,
            createdDate: new Date(),
            publishedBy: {
              id: 1,
              email: 'doquang0310@gmail.com',
              createdDate: new Date(),
            },
          },
          {
            id: 94,
            url: 'https://www.youtube.com/embed/WGPsAQSdU2g',
            title: '[외힙] 목걸이는 무겁게, 방아쇠는 가볍게',
            description:
              '🖤본 채널은 수익 창출을 하지 않습니다\n🖤instagram @iburgeryou__\n\n\n\n\n#외힙 #힙합플레이리스트 #운동할때듣는노래  #외힙플레이리스트  #빵댕이',
            up_vote: 0,
            down_vote: 0,
            createdDate: new Date(),
            publishedBy: {
              id: 1,
              email: 'doquang0310@gmail.com',
              createdDate: new Date(),
            },
          },
          {
            id: 94,
            url: 'https://www.youtube.com/embed/WGPsAQSdU2g',
            title: '[외힙] 목걸이는 무겁게, 방아쇠는 가볍게',
            description:
              '🖤본 채널은 수익 창출을 하지 않습니다\n🖤instagram @iburgeryou__\n\n\n\n\n#외힙 #힙합플레이리스트 #운동할때듣는노래  #외힙플레이리스트  #빵댕이',
            up_vote: 0,
            down_vote: 0,
            createdDate: new Date(),
            publishedBy: {
              id: 1,
              email: 'doquang0310@gmail.com',
              createdDate: new Date(),
            },
          },
        ],
      };
      const params = {
        page: 1,
        limit: 15,
        path: 'http://localhost:3000/videos',
      };
      jest
        .spyOn(videoService, 'findAll')
        .mockImplementation(() => result as any);
      const resultReceived = await videoController.findAll(params);
      expect(resultReceived).toBe(result);
    });
  });

  //test for function create in video controller
  describe('create', () => {
    it('should return a video', async () => {
      const accessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJkb3F1YW5nMDMxMEBnbWFpbC5jb20iLCJpYXQiOjE2ODYwNTk0NDEsImV4cCI6MTY4NjA2MDM0MX0.Y0NeMDfcXg2nPFp3ibyFcGkuZCVjJnhVg_FnV988gas';
      const resultUser: Users = {
        id: 1,
        email: 'doquang0310@gmail.com',
        createdDate: new Date(),
        password: '',
        videos: [],
      };
      const resultVideo: Videos = {
        id: 94,
        url: 'https://www.youtube.com/embed/WGPsAQSdU2g',
        title: '[외힙] 목걸이는 무겁게, 방아쇠는 가볍게',
        description:
          '🖤본 채널은 수익 창출을 하지 않습니다\n🖤instagram @iburgeryou__\n\n\n\n\n#외힙 #힙합플레이리스트 #운동할때듣는노래  #외힙플레이리스트  #빵댕이',
        up_vote: 0,
        down_vote: 0,
        createdDate: new Date(),
        publishedBy: resultUser,
      };

      const params = {
        url: 'https://www.youtube.com/embed/WGPsAQSdU2g',
      };
      jest
        .spyOn(videoService, 'create')
        .mockImplementation(() => Promise.resolve(resultVideo));
      jest
        .spyOn(userService, 'findOneByEmail')
        .mockImplementation(() => Promise.resolve(resultUser));
      const resultReceived = await videoController.create(accessToken, params);
      expect(resultReceived).toBe(resultVideo);
    });

    it('should throw error when user not found', async () => {
      const accessToken = 'accessToken';
      const params = {
        url: 'https://www.youtube.com/embed/WGPsAQSdU2g',
      };
      jest
        .spyOn(userService, 'findOneByEmail')
        .mockImplementation(() => Promise.resolve(null));
      await expect(videoController.create(accessToken, params)).rejects.toThrow(
        new UnauthorizedException(),
      );
    });
  });
});
