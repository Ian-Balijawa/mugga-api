import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { createRequestValidator } from '../middlewares/request-validator.middleware';
import { paymentSchema } from '../validators/payment.validator';
const router = Router();
const paymentController = new PaymentController();

router.use( authenticate );
router.use( authorize( 'loan_officer' ) );

router.post( '/',
    createRequestValidator( { body: paymentSchema } ),
    ( req, res ) => paymentController.create( req, res )
);

router.get( '/loan/:loanId',
    ( req, res ) => paymentController.findByLoan( req, res )
);

router.patch( '/:id',
    createRequestValidator( { body: paymentSchema.partial() } ),
    ( req, res ) => paymentController.update( req, res )
);

router.delete( '/:id',
    authorize( 'admin' ),
    ( req, res ) => paymentController.delete( req, res )
);

export { router as paymentRoutes };
