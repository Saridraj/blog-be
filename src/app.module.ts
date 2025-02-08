import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [ TypeOrmModule.forRoot({
    type: 'mongodb',
    url: 'mongodb://localhost:27017/mydb', // Change to your DB URL
    database: 'blog',
    entities: [__dirname + '/**/*.entity{.ts,.js}'], // Load entities dynamically
    synchronize: true, // Auto sync schema (disable in production)
    useUnifiedTopology: true,
  }),AuthModule, PostModule, CommentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
