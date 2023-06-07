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

describe('UserService', () => {
  let authService: AuthService;
  let videoService: VideoService;
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
    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UserService>(UserService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  describe('Auth Service', () => {
    it('SignIn success', async () => {
      const hash = await bcrypt.hash('123456', 10);
      const accessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJkb3F1YW5nMDMxMEBnbWFpbC5jb20iLCJpYXQiOjE2ODYwNDM1NDgsImV4cCI6MTY4NjA0NDQ0OH0.lQngV9o7iyt9SflU--P44Es2w8OjE8dBZNc9V_DvkLk';
      const resultUser: Users = {
        id: 1,
        email: 'doquang0310@gmail.com',
        password: hash,
        createdDate: new Date(),
        videos: [],
      };

      jest
        .spyOn(jwtService, 'signAsync')
        .mockImplementation(() => Promise.resolve(accessToken));

      const result = await authService.signIn(resultUser, '123456');
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('user');
      expect(result.data.user).toEqual({
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJkb3F1YW5nMDMxMEBnbWFpbC5jb20iLCJpYXQiOjE2ODYwNDM1NDgsImV4cCI6MTY4NjA0NDQ0OH0.lQngV9o7iyt9SflU--P44Es2w8OjE8dBZNc9V_DvkLk',
        email: 'doquang0310@gmail.com',
      });
    });

    it('signUp fail with email wrong format', async () => {
      const wrongEmail = 'cmvhxmvhnmxcvn';

      expect(authService.signUp(wrongEmail, '456456456')).rejects.toThrow(
        new BadRequestException('Invalid email format'),
      );
    });

    it('SignIn fail & email already exists', async () => {
      const hash = await bcrypt.hash('123456', 10);
      const accessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJkb3F1YW5nMDMxMEBnbWFpbC5jb20iLCJpYXQiOjE2ODYwNDM1NDgsImV4cCI6MTY4NjA0NDQ0OH0.lQngV9o7iyt9SflU--P44Es2w8OjE8dBZNc9V_DvkLk';
      const resultUser: Users = {
        id: 1,
        email: 'doquang0310@gmail.com',
        password: hash,
        createdDate: new Date(),
        videos: [],
      };

      expect(authService.signIn(resultUser, '456456456')).rejects.toThrow(
        new UnauthorizedException('Unauthorized'),
      );
    });

    it('SignUp success', async () => {
      const hash = await bcrypt.hash('123456', 10);

      const payload = {
        email: 'doquang0310@gmail.com',
        password: '123456',
      };

      const accessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJkb3F1YW5nMDMxMEBnbWFpbC5jb20iLCJpYXQiOjE2ODYwNDM1NDgsImV4cCI6MTY4NjA0NDQ0OH0.lQngV9o7iyt9SflU--P44Es2w8OjE8dBZNc9V_DvkLk';

      const resultUser: Users = {
        id: 1,
        email: 'doquang0310@gmail.com',
        password: hash,
        createdDate: new Date(),
        videos: [],
      };

      jest
        .spyOn(jwtService, 'signAsync')
        .mockImplementation((payloadJwt) => Promise.resolve(accessToken));

      jest
        .spyOn(userRepository, 'save')
        .mockImplementation((payload) => Promise.resolve(resultUser));
      const result = await authService.signUp(payload.email, payload.password);
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('user');
      expect(result.data.user).toEqual({
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJkb3F1YW5nMDMxMEBnbWFpbC5jb20iLCJpYXQiOjE2ODYwNDM1NDgsImV4cCI6MTY4NjA0NDQ0OH0.lQngV9o7iyt9SflU--P44Es2w8OjE8dBZNc9V_DvkLk',
        email: 'doquang0310@gmail.com',
      });
    });

    it('decode jwt', async () => {
      const accessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJkb3F1YW5nMDMxMEBnbWFpbC5jb20iLCJpYXQiOjE2ODYwNDM1NDgsImV4cCI6MTY4NjA0NDQ0OH0.lQngV9o7iyt9SflU--P44Es2w8OjE8dBZNc9V_DvkLk';
      const result = await authService.decodeAuthToken(accessToken);
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('iat');
      expect(result).toHaveProperty('exp');
      expect(result.email).toEqual('doquang0310@gmail.com');
    });
  });
});
