import { Router } from 'express';
import { LoanOfficerController } from '../controllers/loan-officer.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();
const loanOfficerController = new LoanOfficerController();

router.post( '/',
  authenticate,
  authorize( 'admin' ),
  ( req, res ) => loanOfficerController.create( req, res )
);

router.get( '/',
  authenticate,
  authorize( 'admin' ),
  ( req, res ) => loanOfficerController.findAll( req, res )
);

router.get( '/:id',
  authenticate,
  authorize( 'admin' ),
  ( req, res ) => loanOfficerController.findById( req, res )
);

router.patch( '/:id',
  authenticate,
  authorize( 'admin' ),
  ( req, res ) => loanOfficerController.update( req, res )
);

router.delete( '/:id',
  authenticate,
  authorize( 'admin' ),
  ( req, res ) => loanOfficerController.delete( req, res )
);

router.get( '/:id/borrowers',
  authenticate,
  authorize( 'admin' ),
  ( req, res ) => loanOfficerController.findWithBorrowers( req, res )
);

export { router as loanOfficerRoutes };
