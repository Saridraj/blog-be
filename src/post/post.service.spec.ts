import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Posts } from './post.entity';
import { ObjectId } from 'mongodb';
import { HttpException } from '@nestjs/common';

describe('PostService', () => {
  let postService: PostService;
  let postRepository: MongoRepository<Posts>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(Posts),
          useClass: MongoRepository,
        },
      ],
    }).compile();

    postService = module.get<PostService>(PostService);
    postRepository = module.get<MongoRepository<Posts>>(
      getRepositoryToken(Posts),
    );
  });

  const mockPostId = new ObjectId();
  const mockPost = {
    id: mockPostId,
    topic: 'Sample Topic',
    content: 'Sample Content',
    community: 'Sample Community',
    createdBy: 'User123',
    createdAt: new Date(),
  };

  describe('createPost', () => {
    it('should create and return a post', async () => {
      jest.spyOn(postRepository, 'save').mockResolvedValue(mockPost);
      const result = await postService.createPost(mockPost as Posts);
      expect(result).toEqual(mockPost);
    });

    it('should throw an error if post creation fails', async () => {
      jest.spyOn(postRepository, 'save').mockRejectedValue(new Error('DB Error'));
      await expect(postService.createPost(mockPost as Posts)).rejects.toThrow(HttpException);
    });
  });

  describe('getAllPosts', () => {
    it('should return an array of posts', async () => {
      jest.spyOn(postRepository, 'find').mockResolvedValue([mockPost]);
      const result = await postService.getAllPosts();
      expect(result).toEqual([mockPost]);
      expect(postRepository.find).toHaveBeenCalled();
    });

    it('should throw an error if fetching fails', async () => {
      jest.spyOn(postRepository, 'find').mockRejectedValue(new Error('DB Error'));
      await expect(postService.getAllPosts()).rejects.toThrow(HttpException);
    });
  });

  describe('getOnePost', () => {
    it('should return a post if found', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(mockPost);
      const result = await postService.getOnePost(mockPostId.toString());
      expect(result).toEqual(mockPost);
      expect(postRepository.findOne).toHaveBeenCalledWith({ where: { _id: mockPostId } });
    });

    it('should throw an error if post not found', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(null);
      await expect(postService.getOnePost(mockPostId.toString())).rejects.toThrow(HttpException);
    });
  });

  describe('updatePost', () => {
    it('should update and return the updated post', async () => {
      const updatedData = { topic: 'Updated Topic', content: 'Updated Content', community: 'Updated Community' };

      jest.spyOn(postRepository, 'findOne').mockResolvedValue(mockPost);
      jest.spyOn(postRepository, 'updateOne').mockResolvedValue({ matchedCount: 1 } as any);
      jest.spyOn(postRepository, 'findOne').mockResolvedValue({ ...mockPost, ...updatedData });

      const result = await postService.updatePost(mockPostId.toString(), updatedData as Posts);
      expect(result.topic).toBe('Updated Topic');
      expect(postRepository.updateOne).toHaveBeenCalled();
    });

    it('should throw an error if the post does not exist', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(null);
      await expect(postService.updatePost(mockPostId.toString(), {} as Posts)).rejects.toThrow(HttpException);
    });

    it('should throw an error if update fails', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(mockPost);
      jest.spyOn(postRepository, 'updateOne').mockResolvedValue({ matchedCount: 0 } as any);
      await expect(postService.updatePost(mockPostId.toString(), {} as Posts)).rejects.toThrow(HttpException);
    });
  });

  describe('deletePost', () => {
    it('should delete the post successfully', async () => {
      jest
        .spyOn(postRepository, 'deleteOne')
        .mockResolvedValue({ deletedCount: 1 } as any);
      const result = await postService.deletePost(mockPostId.toString());
      expect(result).toEqual({ message: 'Post deleted successfully' });
      expect(postRepository.deleteOne).toHaveBeenCalledWith({
        _id: mockPostId,
      });
    });

    it('should throw an error if the post is not found', async () => {
      jest
        .spyOn(postRepository, 'deleteOne')
        .mockResolvedValue({ deletedCount: 0 } as any);
      await expect(
        postService.deletePost(mockPostId.toString()),
      ).rejects.toThrow(HttpException);
    });
  });
});
