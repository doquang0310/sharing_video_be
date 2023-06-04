import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() body: UserDto): Promise<UserEntity> {
    const user = await this.userService.findOneByEmail(body.email);

    if (!user) {
      return this.userService.createUser(body.email, body.password);
    }

    const match = await this.userService.verifyPassword(user, body.password);

    if (!match) {
      throw new BadRequestException('Wrong email or password');
    }

    return user;
  }
}
