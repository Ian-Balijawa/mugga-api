import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { LoanController } from '../controllers/loan.controller';
import { logActivity } from '../middlewares/activity-logger.middleware';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

const router = Router();
const loanController = new LoanController();

router.use(authenticate);
router.use(logActivity('loan'));

router.post( '/',
  authorize( 'loan_officer' ),
  ( req, res ) => loanController.create( req, res )
);

router.get( '/',
  authorize( 'loan_officer', 'admin' ),
  ( req, res ) => loanController.findAll( req, res )
);

router.get( '/:id',
  authorize( 'loan_officer', 'admin' ),
  ( req, res ) => loanController.findById( req, res )
);

router.put( '/:id',
  authorize( 'loan_officer', 'admin' ),
  ( req, res ) => loanController.update( req, res )
);

router.delete( '/:id',
  authorize( 'admin' ),
  ( req, res ) => loanController.delete( req, res )
);

router.patch( '/:id/status',
  authorize( 'admin', 'loan_officer' ),
  ( req, res ) => loanController.updateStatus( req, res )
);

router.patch( '/:id/extend-maturity',
  authorize( 'loan_officer' ),
  async ( req: ExpressRequest, res: ExpressResponse ) => {
    await loanController.extendMaturity( req, res );
  }
);

export { router as loanRoutes };
