import { UserEntity } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class VideoEntity {
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

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.videos)
  publishedBy: UserEntity;

  @CreateDateColumn()
  createdDate: Date;
}
