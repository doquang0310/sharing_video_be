import { Exclude } from 'class-transformer';
import { Videos } from '../../videos/entities/video.entity';
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

  @Exclude()
  @Column({ select: false})
  password: string;

  @Exclude()
  videos : Videos[];

  @CreateDateColumn()
  createdDate: Date;
}
