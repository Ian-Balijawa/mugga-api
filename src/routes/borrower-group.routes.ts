import { Router } from 'express';
import { BorrowerGroupController } from '../controllers/borrower-group.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();
const borrowerGroupController = new BorrowerGroupController();

router.use( authenticate );
router.use( authorize( 'loan_officer' ) );

router.post( '/', ( req, res ) => borrowerGroupController.create( req, res ) );
router.get( '/', ( req, res ) => borrowerGroupController.findAll( req, res ) );
router.get( '/:id', ( req, res ) => borrowerGroupController.findById( req, res ) );
router.patch( '/:id', ( req, res ) => borrowerGroupController.update( req, res ) );
router.delete( '/:id', ( req, res ) => borrowerGroupController.delete( req, res ) );
router.post( '/:id/borrowers', ( req, res ) => borrowerGroupController.addBorrower( req, res ) );

export { router as borrowerGroupRoutes };
