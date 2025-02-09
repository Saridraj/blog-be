import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Posts } from './post.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class PostService {
  @InjectRepository(Posts)
  private postRepository: MongoRepository<Posts>;

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
      // Handle the error appropriately
      return new Error(`Failed to create post: ${error.message}`);
    }
  }

  async getAllPosts() {
    try {
      return await this.postRepository.find();
    } catch (error) {
      return new Error(`Failed to fetch posts: ${error.message}`);
    }
  }

  async getOnePost(postId: string) {
    try {
      return await this.postRepository.find({ _id: new ObjectId(postId) });
    } catch (error) {
      return new Error(`Failed to fetch post: ${error.message}`);
    }
  }

  async getPostsOfUser(userId: string) {
    try {
      return await this.postRepository.find({
        where: { createdBy: userId },
      });
    } catch (error) {
      return new Error(`Failed to fetch posts: ${error.message}`);
    }
  }

  async updatePost(postId: string, postData: Posts) {
    try {
      return await this.postRepository.updateOne(
        { _id: new ObjectId(postId) },
        {
          $set: {
            topic: postData.topic,
            content: postData.content,
            community: postData.community,
          },
        },
      );
    } catch (error) {
      return new Error(`Failed to update post: ${error.message}`);
    }
  }

  async deletePost(postId: string) {
    try {
      return await this.postRepository.deleteOne({ _id: new ObjectId(postId) });
    } catch (error) {
      return new Error(`Failed to delete post: ${error.message}`);
    }
  }
}
