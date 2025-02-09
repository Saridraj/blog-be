import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comments } from './comment.entity';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';

describe('CommentService', () => {
  let commentService: CommentService;
  let commentRepository: Repository<Comments>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(Comments),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    commentService = module.get<CommentService>(CommentService);
    commentRepository = module.get<Repository<Comments>>(getRepositoryToken(Comments));
  });

  describe('createComment', () => {
    it('should successfully create a comment', async () => {
      const commentData = {
        comment: 'This is a test comment',
        postId: '123',
        createdBy: 'user1',
      };

      jest.spyOn(commentRepository, 'save').mockResolvedValue({
        ...commentData,
        id: new ObjectId(),
        createdAt: new Date(),
      });

      const result = await commentService.createComment(commentData as Comments);
      expect(result).toHaveProperty('comment', 'This is a test comment');
      expect(commentRepository.save).toHaveBeenCalled();
    });
  });

  describe('getAllComments', () => {
    it('should return all comments', async () => {
      const mockComments = [
        { comment: 'First comment', postId: '123', createdBy: 'user1' },
        { comment: 'Second comment', postId: '456', createdBy: 'user2' },
      ];

      jest.spyOn(commentRepository, 'find').mockResolvedValue(mockComments as Comments[]);

      const result = await commentService.getAllComments();
      expect(result).toHaveLength(2);
      expect(result[0].comment).toBe('First comment');
    });
  });
});
