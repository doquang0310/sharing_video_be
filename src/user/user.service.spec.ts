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
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

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
      providers: [AuthService, UserService, JwtService],
    }).compile();

    userRepository = moduleRef.get('UsersRepository');
    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UserService>(UserService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  describe('User Service', () => {
    it('find one by email sucesss', async () => {
      const hash = await bcrypt.hash('123456', 10);

      const resultUser: Users = {
        id: 1,
        email: 'doquang0310@gmail.com',
        password: hash,
        createdDate: new Date(),
        videos: [],
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(resultUser);

      const result = await userService.findOneByEmail('doquang0310@gmail.com');
      expect(result).toEqual(resultUser);
    });
  });
});
