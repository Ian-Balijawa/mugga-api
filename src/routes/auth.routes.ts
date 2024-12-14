import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { createRequestValidator } from '../middlewares/request-validator.middleware';
import { AuthController } from '../controllers/auth.controller';
import { authorize } from '../middlewares/auth.middleware';
import {
    forgotPasswordSchema,
    verifySecurityCodeSchema,
    verifyEmailSchema,
    toggleActivationSchema
} from '../validators/auth.validator';

const router = Router();
const authController = new AuthController();

router.post( '/forgot-password',
    createRequestValidator( { body: forgotPasswordSchema } ),
    ( req, res ) => authController.forgotPassword( req, res )
);

router.post( '/verify-email',
    createRequestValidator( { body: verifyEmailSchema } ),
    ( req, res ) => authController.verifyEmail( req, res )
);

router.post( '/verify-phone',
    ( req, res ) => authController.verifyPhone( req, res )
);

router.post( '/reset-password',
    ( req, res ) => authController.resetPassword( req, res )
);

router.post( '/signin',
    ( req, res ) => authController.signin( req, res )
);

router.post( '/toggle-activation',
    authenticate,
    authorize( 'admin' ),
    createRequestValidator( { body: toggleActivationSchema } ),
    ( req, res ) => authController.toggleActivation( req, res )
);

router.post( '/verify-security-code',
    createRequestValidator( { body: verifySecurityCodeSchema } ),
    ( req, res ) => authController.verifySecurityCode( req, res )
);

export { router as authRoutes };
