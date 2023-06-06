import { IsNotEmpty } from 'class-validator';
import { Users } from 'src/user/entities/user.entity';

export class createVideoDto {
  @IsNotEmpty()
  url: string;
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  publishedBy: Users;
}

export class createVideoByUrlDto {
  @IsNotEmpty()
  url: string;
}

export class findVideoDto {
  @IsNotEmpty()
  id: number;
}
