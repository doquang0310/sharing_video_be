import { Exclude } from 'class-transformer';
import { Videos } from 'src/videos/entities/video.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Users{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  videos : Videos[];

  @CreateDateColumn()
  createdDate: Date;
}
