import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PhotosService } from './photos.service';

@Controller('photos')
export class PhotosController {
  constructor(private service: PhotosService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Query('className') className?: string, @Query('albumName') albumName?: string) {
    return this.service.findAll(className, albumName);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('albums')
  getAlbums() {
    return this.service.getAlbums();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Request() req, @Body() body: { className?: string; albumName?: string; url: string; caption?: string; takenAt?: string }) {
    return this.service.create(req.user.id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.service.remove(id, req.user.id, req.user.role);
  }
}
