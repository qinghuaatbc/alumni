import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import { AlumniProfile } from '../alumni/alumni-profile.entity';

export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'text', default: UserRole.MEMBER })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => AlumniProfile, (profile) => profile.user)
  alumniProfile: AlumniProfile;
}
