import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createUser(email: string, password: string): Promise<UserEntity> {
    const hash = await bcrypt.hash(password, process.env.SALT_ROUNDS!);

    const user = this.userRepository.create({
      email: email,
      password: hash,
    });

    return user;
  }

  async verifyPassword(User: UserEntity, password: string): Promise<boolean> {
    const match = await bcrypt.compare(password, User.password);

    return match;
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({ where: { email } });

    return user;
  }
}
