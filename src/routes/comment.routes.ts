import { Router } from 'express';
import { CommentController } from '../controllers/comment.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { createRequestValidator } from '../middlewares/request-validator.middleware';
import { commentSchema, updateCommentSchema } from '../validators/comment.validator';

const router = Router();
const commentController = new CommentController();

router.post( '/',
  authenticate,
  createRequestValidator( { body: commentSchema } ),
  ( req, res ) => commentController.create( req, res )
);

router.get( '/:type/:id',
  authenticate,
  ( req, res ) => commentController.findByCommentable( req, res )
);

router.patch( '/:id',
  authenticate,
  createRequestValidator( { body: updateCommentSchema } ),
  ( req, res ) => commentController.update( req, res )
);

router.delete( '/:id',
  authenticate,
  ( req, res ) => commentController.delete( req, res )
);

export { router as commentRoutes };




