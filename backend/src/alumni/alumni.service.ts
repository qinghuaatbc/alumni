import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { AlumniProfile } from './alumni-profile.entity';
import { CreateAlumniDto } from './dto/create-alumni.dto';
import { QueryAlumniDto } from './dto/query-alumni.dto';
import { User, UserRole } from '../users/user.entity';

@Injectable()
export class AlumniService {
  constructor(
    @InjectRepository(AlumniProfile)
    private alumniRepository: Repository<AlumniProfile>,
  ) {}

  async findAll(query: QueryAlumniDto) {
    const { name, className, city, graduationYear, page = 1, limit = 20 } = query;

    const qb = this.alumniRepository.createQueryBuilder('profile');

    if (name) {
      qb.andWhere('profile.name LIKE :name', { name: `%${name}%` });
    }
    if (className) {
      qb.andWhere('profile.className LIKE :className', { className: `%${className}%` });
    }
    if (city) {
      qb.andWhere('profile.city LIKE :city', { city: `%${city}%` });
    }
    if (graduationYear) {
      qb.andWhere('profile.graduationYear = :graduationYear', { graduationYear });
    }

    const total = await qb.getCount();
    qb.skip((page - 1) * limit).take(limit);
    qb.orderBy('profile.createdAt', 'DESC');

    const items = await qb.getMany();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<AlumniProfile> {
    const profile = await this.alumniRepository.findOne({ where: { id } });
    if (!profile) {
      throw new NotFoundException(`Alumni profile #${id} not found`);
    }
    return profile;
  }

  async findByUserId(userId: number): Promise<AlumniProfile | null> {
    return this.alumniRepository.findOne({ where: { userId } });
  }

  async createOrUpdate(userId: number, dto: CreateAlumniDto): Promise<AlumniProfile> {
    let profile = await this.findByUserId(userId);

    if (profile) {
      Object.assign(profile, dto);
      return this.alumniRepository.save(profile);
    }

    const newProfile = this.alumniRepository.create({ ...dto, userId });
    return this.alumniRepository.save(newProfile);
  }

  async update(id: number, userId: number, dto: CreateAlumniDto, user: User): Promise<AlumniProfile> {
    const profile = await this.findOne(id);

    if (profile.userId !== userId && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only update your own profile');
    }

    Object.assign(profile, dto);
    return this.alumniRepository.save(profile);
  }

  async remove(id: number, user: User): Promise<void> {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can delete profiles');
    }

    const profile = await this.findOne(id);
    await this.alumniRepository.remove(profile);
  }

  async getStats() {
    const total = await this.alumniRepository.count();

    const cityStats = await this.alumniRepository
      .createQueryBuilder('profile')
      .select('profile.city', 'city')
      .addSelect('COUNT(*)', 'count')
      .where('profile.city IS NOT NULL')
      .groupBy('profile.city')
      .orderBy('count', 'DESC')
      .getRawMany();

    const yearStats = await this.alumniRepository
      .createQueryBuilder('profile')
      .select('profile.graduationYear', 'graduationYear')
      .addSelect('COUNT(*)', 'count')
      .where('profile.graduationYear IS NOT NULL')
      .groupBy('profile.graduationYear')
      .orderBy('profile.graduationYear', 'ASC')
      .getRawMany();

    return {
      total,
      cityDistribution: cityStats,
      yearDistribution: yearStats,
    };
  }
}
