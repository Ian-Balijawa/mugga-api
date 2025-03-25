import { Router } from 'express';

import { authenticate, authorize } from '../middlewares/auth.middleware';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

router.post( '/login',
    authController.login.bind( authController )
);

router.post( '/logout',
    authenticate,
    authController.logout.bind( authController )
);

router.get( '/me',
    authenticate,
    authController.getCurrentUser.bind( authController )
);

router.post( '/signup',
    authController.signup.bind( authController )
);

router.patch( '/:id',
    authenticate,
    authorize( 'admin' ),
    authController.update.bind( authController )
);

router.delete( '/:id',
    authenticate,
    authorize( 'admin' ),
    authController.delete.bind( authController )
);

export { router as adminRoutes };
