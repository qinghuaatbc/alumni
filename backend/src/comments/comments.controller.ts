import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private service: CommentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findByProfile(@Query('profileId', ParseIntPipe) profileId: number) {
    return this.service.findByProfile(profileId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Request() req, @Body() body: { profileId: number; content: string }) {
    return this.service.create(body.profileId, req.user.id, body.content);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.service.remove(id, req.user.id, req.user.role);
  }
}
