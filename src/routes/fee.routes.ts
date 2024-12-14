import { Router } from 'express';
import { FeeController } from '../controllers/fee.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();
const feeController = new FeeController();

router.use( authenticate );
router.use( authorize( 'loan_officer' ) );

router.post( '/', feeController.create.bind( feeController ) );
router.get( '/', feeController.findAll.bind( feeController ) );
router.get( '/:id', feeController.findById.bind( feeController ) );
router.delete( '/:id', feeController.delete.bind( feeController ) );

export { router as feeRoutes };
