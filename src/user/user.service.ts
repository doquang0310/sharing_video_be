import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async findOneByEmail(email: string): Promise<Users | null> {
    const user = await this.userRepository.findOne({ where: { email }, select: ['id', 'email', 'password'] });
    console.log(user)
    return user;
  }
}
