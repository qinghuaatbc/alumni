import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TvChannel } from './tv-channel.entity';
import { TvService } from './tv.service';
import { TvController } from './tv.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TvChannel])],
  providers: [TvService],
  controllers: [TvController],
})
export class TvModule {}
