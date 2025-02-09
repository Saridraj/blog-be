import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comments } from './comment.entity';

@Module({
   imports: [TypeOrmModule.forFeature([Comments]),  ConfigModule.forRoot({ isGlobal: true})],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule {}
