import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import { validateEmail } from '../../ultis/regex';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async findOneByEmail(email: string): Promise<Users | null> {

    const valiedateEmail = validateEmail(email);

    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
    return user;
  }
}
