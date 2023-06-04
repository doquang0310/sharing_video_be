import { IsNotEmpty } from 'class-validator';

export class createVideoDto {
  @IsNotEmpty()
  url: string;
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
}

export class createVideoByUrlDto {
  @IsNotEmpty()
  url: string;
}

export class findVideoDto {
  @IsNotEmpty()
  id: number;
}
