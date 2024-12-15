import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import multer from 'multer';
import { GalleryController } from '../controllers/gallery.controller';

const router = Router();
const galleryController = new GalleryController();
const upload = multer( { storage: multer.memoryStorage() } );

/**
 * @swagger
 * components:
 *   schemas:
 *     GalleryItem:
 *       type: object
 *       required:
 *         - title
 *         - category
 *         - date
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Auto-generated gallery item ID
 *         title:
 *           type: string
 *           description: Title of the gallery item
 *         category:
 *           type: string
 *           enum: [events, facilities, training, competitions]
 *           description: Category of the gallery item
 *         imageUrl:
 *           type: string
 *           format: uri
 *           description: URL to the gallery image
 *         date:
 *           type: string
 *           format: date
 *           description: Date of the event/photo
 */

/**
 * @swagger
 * /api/gallery:
 *   get:
 *     summary: Get all gallery items
 *     tags: [Gallery]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [events, facilities, training, competitions]
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: List of gallery items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GalleryItem'
 */
router.get( '/', galleryController.findAll.bind( galleryController ) );

/**
 * @swagger
 * /api/gallery/{id}:
 *   get:
 *     summary: Get gallery item by ID
 *     tags: [Gallery]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Gallery item ID
 *     responses:
 *       200:
 *         description: Gallery item details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/GalleryItem'
 *       404:
 *         description: Gallery item not found
 */
router.get( '/:id', galleryController.findById.bind( galleryController ) );

/**
 * @swagger
 * /api/gallery/category/{category}:
 *   get:
 *     summary: Get gallery items by category
 *     tags: [Gallery]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [events, facilities, training, competitions]
 *         description: Gallery category
 *     responses:
 *       200:
 *         description: List of gallery items in category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GalleryItem'
 */
router.get( '/category/:category', galleryController.findByCategory.bind( galleryController ) );

// Protected routes
router.use( authenticate );
router.use( authorize( 'admin' ) );

/**
 * @swagger
 * /api/gallery:
 *   post:
 *     summary: Create a new gallery item
 *     tags: [Gallery]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - category
 *               - date
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [events, facilities, training, competitions]
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Gallery item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/GalleryItem'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires admin role
 */
router.post( '/',
    upload.single( 'image' ),
    galleryController.create.bind( galleryController )
);

/**
 * @swagger
 * /api/gallery/{id}:
 *   put:
 *     summary: Update a gallery item
 *     tags: [Gallery]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Gallery item ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [events, facilities, training, competitions]
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Gallery item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/GalleryItem'
 */
router.put( '/:id',
    upload.single( 'image' ),
    galleryController.update.bind( galleryController )
);

/**
 * @swagger
 * /api/gallery/{id}:
 *   delete:
 *     summary: Delete a gallery item
 *     tags: [Gallery]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Gallery item ID
 *     responses:
 *       204:
 *         description: Gallery item deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires admin role
 *       404:
 *         description: Gallery item not found
 */
router.delete( '/:id', galleryController.delete.bind( galleryController ) );

export { router as galleryRoutes };
