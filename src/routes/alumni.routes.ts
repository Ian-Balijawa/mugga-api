import { Router } from 'express';
import { AlumniController } from '../controllers/alumni.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();
const controller = new AlumniController();

// Public routes
router.get( '/', controller.findAll.bind( controller ) );
router.get( '/:id', controller.findById.bind( controller ) );

// Protected routes
router.post( '/', authenticate, authorize( 'admin' ), controller.create.bind( controller ) );
router.put( '/:id', authenticate, authorize( 'admin' ), controller.update.bind( controller ) );
router.delete( '/:id', authenticate, authorize( 'admin' ), controller.delete.bind( controller ) );
router.patch( '/:id/restore', authenticate, authorize( 'admin' ), controller.restore.bind( controller ) );

export default router;
