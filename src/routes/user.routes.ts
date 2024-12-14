import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();
const userController = new UserController();

router.post( '/',
  authenticate,
  authorize( 'admin' ),
  ( req, res ) => userController.create( req, res )
);

router.get( '/',
  authenticate,
  authorize( 'admin' ),
  ( req, res ) => userController.findAll( req, res )
);

router.get( '/:id',
  authenticate,
  authorize( 'admin' ),
  ( req, res ) => userController.findById( req, res )
);

router.patch( '/:id',
  authenticate,
  authorize( 'admin' ),
  ( req, res ) => userController.update( req, res )
);

router.delete( '/:id',
  authenticate,
  authorize( 'admin' ),
  ( req, res ) => userController.delete( req, res )
);

export { router as userRoutes };
