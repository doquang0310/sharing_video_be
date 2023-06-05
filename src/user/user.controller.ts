import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { Users } from './entities/user.entity';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
}
