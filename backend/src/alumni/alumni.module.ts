import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlumniProfile } from './alumni-profile.entity';
import { AlumniService } from './alumni.service';
import { AlumniController } from './alumni.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AlumniProfile])],
  providers: [AlumniService],
  controllers: [AlumniController],
})
export class AlumniModule {}
