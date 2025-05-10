import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('links')
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  originalUrl: string;

  @Column({ unique: true })
  shortCode: string;

  @ManyToOne(() => User, (user) => user.links, { onDelete: 'CASCADE' })
  user: User;

  @Column({ default: 0 })
  clickCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
