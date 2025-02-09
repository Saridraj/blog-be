import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Posts } from './post.entity';
import { Authorize } from '../authorize.guard';
import { CanActivate } from '@nestjs/common';
import { ObjectId } from 'mongodb';

describe('PostController', () => {
  let postController: PostController;
  let postService: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: {
            createPost: jest.fn(),
            getAllPosts: jest.fn(),
            getOnePost: jest.fn(),
            getPostsOfUser: jest.fn(),
            deletePost: jest.fn(),
            updatePost: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(Authorize)
      .useValue({ canActivate: jest.fn(() => true) }) // Mocking the guard
      .compile();

    postController = module.get<PostController>(PostController);
    postService = module.get<PostService>(PostService);
  });

  const mockPost: Posts = {
    id: new ObjectId(),
    topic: 'NestJS Testing',
    content: 'This is a test post.',
    community: 'nestjs',
    createdBy: 'testUser',
    createdAt: new Date(),
  };

  describe('createPost', () => {
    it('should create a post successfully', async () => {
      jest.spyOn(postService, 'createPost').mockResolvedValue(mockPost);
      const result = await postController.createPost(mockPost);
      expect(result).toEqual(mockPost);
      expect(postService.createPost).toHaveBeenCalledWith(mockPost);
    });

    it('should handle errors when creating a post', async () => {
      jest
        .spyOn(postService, 'createPost')
        .mockRejectedValue(new Error('Failed to create post'));

      await expect(postController.createPost(mockPost)).rejects.toThrow(Error);
    });
  });

  describe('getAllPost', () => {
    it('should return all posts', async () => {
      const mockPosts = [mockPost, { ...mockPost, topic: 'Another Post' }];
      jest.spyOn(postService, 'getAllPosts').mockResolvedValue(mockPosts);

      const result = await postController.getAllPost();
      expect(result).toEqual(mockPosts);
      expect(postService.getAllPosts).toHaveBeenCalled();
    });

    it('should handle errors when fetching posts', async () => {
      jest
        .spyOn(postService, 'getAllPosts')
        .mockRejectedValue(new Error('Failed to fetch posts'));

      await expect(postController.getAllPost()).rejects.toThrow(Error);
    });
  });

  describe('getOnePost', () => {
    it('should return a single post by ID', async () => {
      jest.spyOn(postService, 'getOnePost').mockResolvedValue(mockPost);
      const result = await postController.getOnePost('123');
      expect(result).toEqual(mockPost);
      expect(postService.getOnePost).toHaveBeenCalledWith('123');
    });

    it('should throw an error if the post is not found', async () => {
      jest
        .spyOn(postService, 'getOnePost')
        .mockRejectedValue(new Error('Post not found'));

      await expect(postController.getOnePost('123')).rejects.toThrow(Error);
    });
  });

  describe('getPostOfUser', () => {
    it('should return posts of a specific user', async () => {
      const mockPosts = [mockPost];
      jest.spyOn(postService, 'getPostsOfUser').mockResolvedValue(mockPosts);

      const result = await postController.getPostOfUser('testUser');
      expect(result).toEqual(mockPosts);
      expect(postService.getPostsOfUser).toHaveBeenCalledWith('testUser');
    });

    it('should handle errors when fetching user posts', async () => {
      jest
        .spyOn(postService, 'getPostsOfUser')
        .mockRejectedValue(new Error('Failed to fetch user posts'));

      await expect(postController.getPostOfUser('testUser')).rejects.toThrow(
        Error,
      );
    });
  });

  describe('deletePost', () => {
    it('should delete a post successfully', async () => {
      jest.spyOn(postService, 'deletePost').mockResolvedValue({
        message: 'Post deleted successfully',
      });

      const result = await postController.deletePost('123');
      expect(result).toEqual({ message: 'Post deleted successfully' });
      expect(postService.deletePost).toHaveBeenCalledWith('123');
    });

    it('should handle errors when deleting a post', async () => {
      jest
        .spyOn(postService, 'deletePost')
        .mockRejectedValue(new Error('Failed to delete post'));

      await expect(postController.deletePost('123')).rejects.toThrow(Error);
    });
  });

  describe('updatePost', () => {
    it('should update a post successfully', async () => {
      jest.spyOn(postService, 'updatePost').mockResolvedValue(mockPost);

      const result = await postController.updatePost('123', mockPost);
      expect(result).toEqual(mockPost);
      expect(postService.updatePost).toHaveBeenCalledWith('123', mockPost);
    });

    it('should handle errors when updating a post', async () => {
      jest
        .spyOn(postService, 'updatePost')
        .mockRejectedValue(new Error('Failed to update post'));

      await expect(postController.updatePost('123', mockPost)).rejects.toThrow(
        Error,
      );
    });
  });
});
