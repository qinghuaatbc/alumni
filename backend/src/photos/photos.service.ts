import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './photo.entity';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private repo: Repository<Photo>,
  ) {}

  async findAll(className?: string, albumName?: string) {
    const where: any = {};
    if (className) where.className = className;
    if (albumName) where.albumName = albumName;
    return this.repo.find({
      where,
      relations: ['uploader'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAlbums() {
    const photos = await this.repo.find({ order: { createdAt: 'DESC' } });
    const albums = new Map<string, { albumName: string; className: string; cover: string; count: number }>();
    for (const p of photos) {
      const key = p.albumName || '默认相册';
      if (!albums.has(key)) {
        albums.set(key, { albumName: key, className: p.className || '', cover: p.url, count: 0 });
      }
      albums.get(key)!.count++;
    }
    return Array.from(albums.values());
  }

  async create(uploaderId: number, dto: { className?: string; albumName?: string; url: string; caption?: string; takenAt?: string }) {
    const photo = this.repo.create({ uploaderId, ...dto });
    const saved = await this.repo.save(photo);
    return this.repo.findOne({ where: { id: saved.id }, relations: ['uploader'] });
  }

  async remove(id: number, userId: number, role: string) {
    const photo = await this.repo.findOne({ where: { id } });
    if (!photo) throw new NotFoundException('Photo not found');
    if (photo.uploaderId !== userId && role !== 'admin') {
      throw new ForbiddenException('Cannot delete this photo');
    }
    await this.repo.remove(photo);
    return { message: 'Deleted' };
  }
}
