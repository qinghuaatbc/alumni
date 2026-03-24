import {
  Controller, Get, Post, Put, Delete,
  Body, Param, ParseIntPipe, UseGuards, Request, ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TvService } from './tv.service';
import { UserRole } from '../users/user.entity';

@Controller('tv')
export class TvController {
  constructor(private tvService: TvService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('channels')
  findAll() {
    return this.tvService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('channels')
  create(@Request() req, @Body() body) {
    if (req.user.role !== UserRole.ADMIN) throw new ForbiddenException();
    return this.tvService.create(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('channels/:id')
  update(@Param('id', ParseIntPipe) id: number, @Request() req, @Body() body) {
    if (req.user.role !== UserRole.ADMIN) throw new ForbiddenException();
    return this.tvService.update(id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('channels/:id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    if (req.user.role !== UserRole.ADMIN) throw new ForbiddenException();
    return this.tvService.remove(id);
  }
}
