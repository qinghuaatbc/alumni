import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uploaderId: number;

  @Column({ nullable: true })
  className: string; // 班级

  @Column({ nullable: true })
  albumName: string; // 相册名

  @Column()
  url: string; // image URL

  @Column({ nullable: true })
  caption: string; // 图片描述

  @Column({ nullable: true })
  takenAt: string; // 拍摄时间 (YYYY-MM-DD)

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploaderId' })
  uploader: User;

  @CreateDateColumn()
  createdAt: Date;
}
