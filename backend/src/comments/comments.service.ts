import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private repo: Repository<Comment>,
  ) {}

  async findByProfile(profileId: number) {
    return this.repo.find({
      where: { profileId },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(profileId: number, authorId: number, content: string) {
    const comment = this.repo.create({ profileId, authorId, content });
    const saved = await this.repo.save(comment);
    return this.repo.findOne({ where: { id: saved.id }, relations: ['author'] });
  }

  async remove(id: number, userId: number, role: string) {
    const comment = await this.repo.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.authorId !== userId && role !== 'admin') {
      throw new ForbiddenException('Cannot delete this comment');
    }
    await this.repo.remove(comment);
    return { message: 'Deleted' };
  }
}
