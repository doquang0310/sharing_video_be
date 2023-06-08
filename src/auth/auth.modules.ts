import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [AuthService, UserService],
  controllers: [AuthController],
})
export class AuthModule {}
