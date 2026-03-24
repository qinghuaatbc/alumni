import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class AlumniProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @OneToOne(() => User, (user) => user.alumniProfile)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  name: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  birthday: string;

  @Column({ nullable: true })
  school: string;

  @Column({ nullable: true })
  className: string;

  @Column({ nullable: true })
  studentId: string;

  @Column({ nullable: true, type: 'int' })
  enrollYear: number;

  @Column({ nullable: true, type: 'int' })
  graduationYear: number;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  wechat: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  profession: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true, type: 'text' })
  bio: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
