import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Users } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginResponse } from './auth.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async signIn(user: Users, password: string): Promise<LoginResponse> {
    const match = await bcrypt.compare(password, user.password);
    
    if (!match) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
      data: {
        user : {
          email : user.email
        }
      },
    };
  }

  async signUp(email: string, password: string): Promise<LoginResponse> {
    const hash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS!));

    const user = await this.userRepository.save({
      email: email,
      password: hash,
    });

    const payload = { sub: user.id, username: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
      data: {
        user : {
          email : user.email
        }
      },
    };
  }
}
