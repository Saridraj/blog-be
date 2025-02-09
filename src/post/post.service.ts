import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Posts } from './post.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Posts)
    private readonly postRepository: MongoRepository<Posts>,
  ) {}

  async createPost(postData: Posts) {
    try {
      return await this.postRepository.save({
        topic: postData.topic,
        content: postData.content,
        community: postData.community,
        createdBy: postData.createdBy,
        createdAt: new Date(),
      });
    } catch (error) {
      throw new HttpException(
        `Failed to create post: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllPosts() {
    try {
      return await this.postRepository.find();
    } catch (error) {
      throw new HttpException(
        `Failed to fetch posts: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOnePost(postId: string) {
    try {
      const post = await this.postRepository.findOne({
        where: { _id: new ObjectId(postId) },
      });

      if (!post) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }

      return post;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch post: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPostsOfUser(userId: string) {
    try {
      return await this.postRepository.find({
        where: { createdBy: userId },
      });
    } catch (error) {
      throw new HttpException(
        `Failed to fetch user posts: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePost(postId: string, postData: Posts) {
    try {

      const existingPost = await this.postRepository.findOne({
        where: { _id: new ObjectId(postId) },
      });
  
      if (!existingPost) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }
  

      const updateResult = await this.postRepository.updateOne(
        { _id: new ObjectId(postId) },
        {
          $set: {
            topic: postData.topic,
            content: postData.content,
            community: postData.community,
          },
        },
      );
  
      if (updateResult.matchedCount === 0) {
        throw new HttpException('Failed to update post', HttpStatus.INTERNAL_SERVER_ERROR);
      }
  

      return await this.postRepository.findOne({
        where: { _id: new ObjectId(postId) },
      });
    } catch (error) {
      throw new HttpException(
        `Failed to update post: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  

  async deletePost(postId: string) {
    try {
      const deleteResult = await this.postRepository.deleteOne({
        _id: new ObjectId(postId),
      });

      if (deleteResult.deletedCount === 0) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }

      return { message: 'Post deleted successfully' };
    } catch (error) {
      throw new HttpException(
        `Failed to delete post: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
