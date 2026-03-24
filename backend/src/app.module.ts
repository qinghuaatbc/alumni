import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AlumniModule } from './alumni/alumni.module';
import { LibraryModule } from './library/library.module';
import { CommentsModule } from './comments/comments.module';
import { MessagesModule } from './messages/messages.module';
import { PhotosModule } from './photos/photos.module';
import { ProxyModule } from './proxy/proxy.module';
import { TvModule } from './tv/tv.module';
import { TvChannel } from './tv/tv-channel.entity';
import { User } from './users/user.entity';
import { AlumniProfile } from './alumni/alumni-profile.entity';
import { Book } from './library/book.entity';
import { BookBorrow } from './library/book-borrow.entity';
import { Comment } from './comments/comment.entity';
import { Message } from './messages/message.entity';
import { Photo } from './photos/photo.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: './alumni.db',
      entities: [User, AlumniProfile, Book, BookBorrow, Comment, Message, Photo, TvChannel],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    AlumniModule,
    LibraryModule,
    CommentsModule,
    MessagesModule,
    PhotosModule,
    ProxyModule,
    TvModule,
  ],
})
export class AppModule {}
