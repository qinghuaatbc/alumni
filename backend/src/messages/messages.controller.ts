import { Controller, Get, Post, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private service: MessagesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('conversations')
  getConversations(@Request() req) {
    return this.service.getConversations(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('unread')
  getUnreadCount(@Request() req) {
    return this.service.getUnreadCount(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('conversation/:userId')
  getConversation(@Request() req, @Param('userId', ParseIntPipe) otherId: number) {
    return this.service.getConversation(req.user.id, otherId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  send(@Request() req, @Body() body: { toId: number; content: string }) {
    return this.service.send(req.user.id, body.toId, body.content);
  }
}
