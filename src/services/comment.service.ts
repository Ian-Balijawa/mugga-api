import { BaseService } from './base.service';
import { Comment, CommentableType } from '../entities/comment.entity';
import { AppDataSource } from '../config/database.config';
import { AppError } from '../middlewares/error-handler.middleware';

export class CommentService extends BaseService<Comment> {
  constructor() {
    super(AppDataSource.getRepository(Comment));
  }

  async create(data: Partial<Comment>): Promise<Comment> {
    const comment = await super.create(data);
    const result = await this.repository.findOne({
      where: { id: comment.id },
      relations: ['commentAuthor']
    });

    if (!result) {
      throw new AppError(404, 'Comment not found');
    }

    return result;
  }

  async findByCommentable(type: CommentableType, id: string): Promise<Comment[]> {
    return this.repository.find({
      where: {
        commentableType: type,
        commentableId: id
      },
      relations: ['commentAuthor'],
      order: {
        createdAt: 'DESC'
      }
    });
  }
}
