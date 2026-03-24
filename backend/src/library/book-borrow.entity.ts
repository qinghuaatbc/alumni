import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Book } from './book.entity';
import { User } from '../users/user.entity';

export enum BorrowStatus {
  BORROWED = 'borrowed',
  RETURNED = 'returned',
}

@Entity()
export class BookBorrow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bookId: number;

  @Column()
  userId: number;

  @Column({ type: 'text' })
  borrowDate: string;

  @Column({ type: 'text' })
  dueDate: string;

  @Column({ type: 'text', nullable: true })
  returnDate: string;

  @Column({ type: 'text', default: BorrowStatus.BORROWED })
  status: BorrowStatus;

  @ManyToOne(() => Book)
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
