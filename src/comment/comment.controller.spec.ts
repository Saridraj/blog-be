import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comments } from './comment.entity';
import { Authorize } from '../authorize.guard';
import { CanActivate } from '@nestjs/common';
import { ObjectId } from 'mongodb';

describe('CommentController', () => {
  let commentController: CommentController;
  let commentService: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        {
          provide: CommentService,
          useValue: {
            createComment: jest.fn(),
            getAllComments: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(Authorize)
      .useValue({ canActivate: jest.fn(() => true) }) // Mock guard
      .compile();

    commentController = module.get<CommentController>(CommentController);
    commentService = module.get<CommentService>(CommentService);
  });

  const mockComment: Comments = {
    id: new ObjectId(),
    comment: 'This is a test comment',
    postId: '123',
    createdBy: 'testUser',
    createdAt: new Date(),
  };

  describe('createComment', () => {
    it('should create a comment successfully', async () => {
      jest.spyOn(commentService, 'createComment').mockResolvedValue(mockComment);
      const result = await commentController.createComment(mockComment);
      expect(result).toEqual(mockComment);
      expect(commentService.createComment).toHaveBeenCalledWith(mockComment);
    });

    it('should handle errors when creating a comment', async () => {
      jest
        .spyOn(commentService, 'createComment')
        .mockRejectedValue(new Error('Failed to create comment'));

      await expect(commentController.createComment(mockComment)).rejects.toThrow(Error);
    });
  });

  describe('getAllComments', () => {
    it('should return all comments', async () => {
      const mockComments = [mockComment, { ...mockComment, comment: 'Another comment' }];
      jest.spyOn(commentService, 'getAllComments').mockResolvedValue(mockComments);

      const result = await commentController.getAllComments();
      expect(result).toEqual(mockComments);
      expect(commentService.getAllComments).toHaveBeenCalled();
    });

    it('should handle errors when fetching comments', async () => {
      jest
        .spyOn(commentService, 'getAllComments')
        .mockRejectedValue(new Error('Failed to fetch comments'));

      await expect(commentController.getAllComments()).rejects.toThrow(Error);
    });
  });
});
