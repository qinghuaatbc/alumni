import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  ParseIntPipe,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { LibraryService } from './library.service';
import { CreateBookDto } from './dto/create-book.dto';
import { QueryBookDto } from './dto/query-book.dto';
import { UserRole } from '../users/user.entity';

const ALLOWED_TYPES = ['.pdf', '.epub', '.mobi', '.txt', '.djvu'];

const uploadStorage = diskStorage({
  destination: join(process.cwd(), 'uploads', 'books'),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, unique + extname(file.originalname));
  },
});

@Controller('library')
export class LibraryController {
  constructor(private libraryService: LibraryService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: uploadStorage }))
  async uploadFile(@Request() req, @UploadedFile() file: Express.Multer.File) {
    if (req.user.role !== UserRole.ADMIN) throw new ForbiddenException('Only admins can upload files');
    if (!file) throw new BadRequestException('No file uploaded');
    const ext = extname(file.originalname).toLowerCase();
    if (!ALLOWED_TYPES.includes(ext)) {
      throw new BadRequestException(`不支持的文件类型，仅支持：${ALLOWED_TYPES.join(', ')}`);
    }
    const serverHost = req.headers.host || 'localhost:3000';
    const url = `${req.protocol || 'http'}://${serverHost}/uploads/books/${file.filename}`;
    return { url, filename: file.originalname, size: file.size };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('books')
  async findAll(@Query() query: QueryBookDto) {
    return this.libraryService.findAll(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('borrows/my')
  async getMyBorrows(@Request() req) {
    return this.libraryService.getMyBorrows(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('books/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.libraryService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('books')
  async create(@Request() req, @Body() dto: CreateBookDto) {
    if (req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can create books');
    }
    return this.libraryService.create(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('books/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() dto: CreateBookDto,
  ) {
    if (req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can update books');
    }
    return this.libraryService.update(id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('books/:id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    if (req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can delete books');
    }
    return this.libraryService.remove(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('books/:id/borrow')
  async borrowBook(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.libraryService.borrowBook(id, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('books/:id/return')
  async returnBook(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.libraryService.returnBook(id, req.user.id);
  }
}
