// write test for video controller
// Path: src\videos\video.controller.spec.ts
// Compare this snippet from src\videos\video.controller.spec.ts:

import { Test } from '@nestjs/testing';
import { VideoController } from '../videos/video.controller';
import { VideoService } from '../videos/video.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Videos } from '../videos/entities/video.entity';
import { Users } from '../user/entities/user.entity';
import { VideoGateway } from '../videos/video.gateway';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { dataSourceOptions } from '../../db/data-source';
import * as bcrypt from 'bcrypt';
import { AuthController } from './auth.controller';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LoginResponse } from './auth.type';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let userRepository: Repository<Users>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Videos, Users]),
        TypeOrmModule.forRoot(dataSourceOptions),
      ],
      controllers: [AuthController],
      providers: [AuthService, UserService, JwtService],
    }).compile();

    userRepository = moduleRef.get('UsersRepository');
    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UserService>(UserService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  describe('Auth Controller', () => {
    it('Login response', async () => {
      const hash = await bcrypt.hash('123456', 10);
      const accessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJkb3F1YW5nMDMxMEBnbWFpbC5jb20iLCJpYXQiOjE2ODYwNDM1NDgsImV4cCI6MTY4NjA0NDQ0OH0.lQngV9o7iyt9SflU--P44Es2w8OjE8dBZNc9V_DvkLk';
      const spySignInResult: LoginResponse = {
        data: {
          user: {
            email: 'doquang0310@gmail.com',
            accessToken: accessToken,
          },
        },
      };
      const resultUser: Users = {
        id: 1,
        email: 'doquang0310@gmail.com',
        password: hash,
        createdDate: new Date(),
        videos: [],
      };

      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(resultUser);
      jest
        .spyOn(authService, 'signIn')
        .mockImplementation(() => Promise.resolve(spySignInResult));
      const result = await authController.login({
        email: 'doquang0310@gmail.com',
        password: '123456',
      });
      expect(result).toEqual(spySignInResult);
    });
  });
});
