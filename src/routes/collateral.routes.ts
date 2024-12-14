import { Router } from 'express';
import { CollateralController } from '../controllers/collateral.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();
const collateralController = new CollateralController();

router.use( authenticate );
router.use( authorize( 'loan_officer' ) );

router.post( '/', ( req, res ) => collateralController.create( req, res ) );
router.get( '/loan/:loanId', ( req, res ) => collateralController.findByLoan( req, res ) );
router.patch( '/:id', ( req, res ) => collateralController.update( req, res ) );
router.delete( '/:id', ( req, res ) => collateralController.delete( req, res ) );

export { router as collateralRoutes };
