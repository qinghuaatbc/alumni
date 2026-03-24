import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { BookBorrow, BorrowStatus } from './book-borrow.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { QueryBookDto } from './dto/query-book.dto';

@Injectable()
export class LibraryService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(BookBorrow)
    private borrowRepository: Repository<BookBorrow>,
  ) {}

  async findAll(query: QueryBookDto) {
    const { title, author, category, page = 1, limit = 12 } = query;

    const qb = this.bookRepository.createQueryBuilder('book');

    if (title) {
      qb.andWhere('book.title LIKE :title', { title: `%${title}%` });
    }
    if (author) {
      qb.andWhere('book.author LIKE :author', { author: `%${author}%` });
    }
    if (category) {
      qb.andWhere('book.category = :category', { category });
    }

    const total = await qb.getCount();
    qb.skip((page - 1) * limit).take(limit);
    qb.orderBy('book.createdAt', 'DESC');

    const items = await qb.getMany();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book #${id} not found`);
    }

    const borrowCount = await this.borrowRepository.count({
      where: { bookId: id, status: BorrowStatus.BORROWED },
    });

    return { ...book, currentBorrowCount: borrowCount };
  }

  async create(dto: CreateBookDto): Promise<Book> {
    const totalCopies = dto.totalCopies ?? 1;
    const book = this.bookRepository.create({
      ...dto,
      totalCopies,
      availableCopies: totalCopies,
    });
    return this.bookRepository.save(book);
  }

  async update(id: number, dto: Partial<CreateBookDto>): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book #${id} not found`);
    }

    // If totalCopies changes, adjust availableCopies proportionally
    if (dto.totalCopies !== undefined && dto.totalCopies !== book.totalCopies) {
      const diff = dto.totalCopies - book.totalCopies;
      book.availableCopies = Math.max(0, book.availableCopies + diff);
    }

    Object.assign(book, dto);
    return this.bookRepository.save(book);
  }

  async remove(id: number): Promise<void> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book #${id} not found`);
    }
    await this.bookRepository.remove(book);
  }

  async borrowBook(bookId: number, userId: number): Promise<BookBorrow> {
    const book = await this.bookRepository.findOne({ where: { id: bookId } });
    if (!book) {
      throw new NotFoundException(`Book #${bookId} not found`);
    }
    if (book.availableCopies <= 0) {
      throw new BadRequestException('No copies available for borrowing');
    }

    // Check if user already has this book borrowed
    const existing = await this.borrowRepository.findOne({
      where: { bookId, userId, status: BorrowStatus.BORROWED },
    });
    if (existing) {
      throw new BadRequestException('You already have this book borrowed');
    }

    const borrowDate = new Date().toISOString().split('T')[0];
    const dueDateObj = new Date();
    dueDateObj.setDate(dueDateObj.getDate() + 30);
    const dueDate = dueDateObj.toISOString().split('T')[0];

    const borrow = this.borrowRepository.create({
      bookId,
      userId,
      borrowDate,
      dueDate,
      status: BorrowStatus.BORROWED,
    });

    book.availableCopies -= 1;
    await this.bookRepository.save(book);

    return this.borrowRepository.save(borrow);
  }

  async returnBook(bookId: number, userId: number): Promise<BookBorrow> {
    const borrow = await this.borrowRepository.findOne({
      where: { bookId, userId, status: BorrowStatus.BORROWED },
    });
    if (!borrow) {
      throw new NotFoundException('No active borrow record found for this book');
    }

    const book = await this.bookRepository.findOne({ where: { id: bookId } });
    if (!book) {
      throw new NotFoundException(`Book #${bookId} not found`);
    }

    borrow.returnDate = new Date().toISOString().split('T')[0];
    borrow.status = BorrowStatus.RETURNED;

    book.availableCopies += 1;
    await this.bookRepository.save(book);

    return this.borrowRepository.save(borrow);
  }

  async getMyBorrows(userId: number) {
    return this.borrowRepository.find({
      where: { userId },
      relations: ['book'],
      order: { createdAt: 'DESC' },
    });
  }
}
