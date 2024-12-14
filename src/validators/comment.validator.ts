import { z } from 'zod';
import { CommentableType } from '../entities/comment.entity';

export const commentSchema = z.object( {
  content: z.string().min( 1 ).max( 1000 ),
  commentableType: z.nativeEnum( CommentableType ),
  commentableId: z.string(),
} );

export const updateCommentSchema = z.object( {
  content: z.string().min( 1, 'Comment content is required' )
} );
