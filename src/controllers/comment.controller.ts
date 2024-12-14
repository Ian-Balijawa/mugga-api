import { Request, Response } from 'express';
import { CommentService } from '../services/comment.service';
import { commentSchema, updateCommentSchema } from '../validators/comment.validator';
import { CommentableType } from '../entities/comment.entity';
import { DeepPartial } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { User } from '../entities/user.entity';

export class CommentController {
  private commentService = new CommentService();

  async create( req: Request, res: Response ): Promise<void> {
    const data = await commentSchema.parseAsync( req.body );
    const comment = await this.commentService.create( {
      ...data,
      commentAuthor: { id: req.user!.userId } as DeepPartial<User>,
      authorType: req.user!.roles.includes( 'loan_officer' ) ? 'loan_officer' : 'borrower'
    } as Partial<Comment> );
    res.status( 201 ).json( comment );
  }

  async findByCommentable( req: Request, res: Response ): Promise<void> {
    const { type, id } = req.params;
    const comments = await this.commentService.findByCommentable(
      type as CommentableType,
      id
    );
    res.json( comments );
  }

  async update( req: Request, res: Response ): Promise<void> {
    const data = await updateCommentSchema.parseAsync( req.body );
    const comment = await this.commentService.update( req.params.id, data );
    res.json( comment );
  }

  async delete( req: Request, res: Response ): Promise<void> {
    await this.commentService.delete( req.params.id );
    res.status( 204 ).send();
  }
}
