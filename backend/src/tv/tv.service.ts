import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TvChannel } from './tv-channel.entity';

@Injectable()
export class TvService {
  constructor(
    @InjectRepository(TvChannel)
    private repo: Repository<TvChannel>,
  ) {}

  findAll() {
    return this.repo.find({ order: { sortOrder: 'ASC', id: 'ASC' } });
  }

  async create(dto: Partial<TvChannel>) {
    const ch = this.repo.create(dto);
    return this.repo.save(ch);
  }

  async update(id: number, dto: Partial<TvChannel>) {
    const ch = await this.repo.findOneBy({ id });
    if (!ch) throw new NotFoundException();
    Object.assign(ch, dto);
    return this.repo.save(ch);
  }

  async remove(id: number) {
    const ch = await this.repo.findOneBy({ id });
    if (!ch) throw new NotFoundException();
    return this.repo.remove(ch);
  }
}
