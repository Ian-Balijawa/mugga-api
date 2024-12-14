import { Router } from 'express';
import { BorrowerController } from '../controllers/borrower.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();
const borrowerController = new BorrowerController();

router.post( '/',
  authenticate,
  authorize( 'loan_officer' ),
  ( req, res ) => borrowerController.create( req, res )
);

router.get( '/',
  authenticate,
  authorize( 'loan_officer', 'admin' ),
  ( req, res ) => borrowerController.findAll( req, res )
);

router.get( '/:id',
  authenticate,
  authorize( 'loan_officer', 'admin' ),
  ( req, res ) => borrowerController.findById( req, res )
);

router.patch( '/:id',
  authenticate,
  authorize( 'loan_officer' ),
  ( req, res ) => borrowerController.update( req, res )
);

router.delete( '/:id',
  authenticate,
  authorize( 'admin' ),
  ( req, res ) => borrowerController.delete( req, res )
);

export { router as borrowerRoutes };
