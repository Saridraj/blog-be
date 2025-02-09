import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Comments } from './comment.entity';

@Injectable()
export class CommentService {
 @InjectRepository(Comments)
  private postRepository: MongoRepository<Comments>;

  async createComment(commentData: Comments) {
    try {
      return await this.postRepository.save({
        comment: commentData.comment,
        postId: commentData.postId,
        createdBy: commentData.createdBy,
        createdAt: new Date(),
      });
    } catch (error) {
      return new Error(`Failed to create comment: ${error.message}`);
    }
  }

    async getAllComments() {
        try {
        return await this.postRepository.find();
        } catch (error) {
        return new Error(`Failed to fetch comments: ${error.message}`);
        }
    }

    

}
