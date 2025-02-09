import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Comments } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comments)
    private readonly commentRepository: MongoRepository<Comments>,
  ) {}

  async createComment(commentData: Comments) {
    try {
      return await this.commentRepository.save({
        comment: commentData.comment,
        postId: commentData.postId,
        createdBy: commentData.createdBy,
        createdAt: new Date(),
      });
    } catch (error) {
      throw new HttpException(
        `Failed to create comment: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllComments() {
    try {
      return await this.commentRepository.find();
    } catch (error) {
      throw new HttpException(
        `Failed to fetch comments: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
