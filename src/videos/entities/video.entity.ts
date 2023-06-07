import { Users } from '../../user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Videos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;
  
  @Column()
  title: string;

  @Column()
  description: string;
  
  @Column()
  up_vote: Number;

  @Column()
  down_vote: Number;

  @ManyToOne(() => Users, (user: Users) => user.videos)
  publishedBy: Users;

  @CreateDateColumn()
  createdDate: Date;
}
