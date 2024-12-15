import { Router } from 'express';
import { PostController } from '../controllers/post.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import multer from 'multer';

const router = Router();
const postController = new PostController();
const upload = multer( { storage: multer.memoryStorage() } );

// Public routes
router.get( '/', postController.findAll.bind( postController ) );
router.get( '/:id', postController.findById.bind( postController ) );

// Protected routes
router.use( authenticate );
router.use( authorize( 'admin' ) );

router.post( '/',
    upload.single( 'image' ),
    postController.create.bind( postController )
);

router.put( '/:id',
    upload.single( 'image' ),
    postController.update.bind( postController )
);

router.delete( '/:id',
    postController.delete.bind( postController )
);

export { router as postRoutes };
