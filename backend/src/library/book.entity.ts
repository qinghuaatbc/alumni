import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ nullable: true })
  isbn: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  cover: string;

  @Column({ nullable: true })
  category: string;

  @Column({ default: 1 })
  totalCopies: number;

  @Column({ default: 1 })
  availableCopies: number;

  @Column({ nullable: true })
  publishYear: number;

  @Column({ nullable: true })
  publisher: string;

  @Column({ nullable: true, type: 'text' })
  readUrl: string;

  @Column({ nullable: true, type: 'text' })
  downloadUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
