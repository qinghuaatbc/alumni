import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fromId: number;

  @Column()
  toId: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  isRead: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'fromId' })
  from: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'toId' })
  to: User;

  @CreateDateColumn()
  createdAt: Date;
}
