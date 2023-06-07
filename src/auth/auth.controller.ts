import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserDto } from '../user/dto/user.dto';
import { AuthService } from './auth.service';
import { LoginResponse } from './auth.type';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: UserDto): Promise<LoginResponse> {
    const user = await this.userService.findOneByEmail(body.email);
    if (!user) {    
      return this.authService.signUp(body.email, body.password);
    }

    const response = await this.authService.signIn(user, body.password);

    return response;
  }
}
