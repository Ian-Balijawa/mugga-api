import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import multer from 'multer';
import { ProgramController } from '../controllers/program.controller';

const router = Router();
const programController = new ProgramController();
const upload = multer( { storage: multer.memoryStorage() } );

/**
 * @swagger
 * components:
 *   schemas:
 *     Program:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - duration
 *         - price
 *         - schedule
 *         - category
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Auto-generated program ID
 *         name:
 *           type: string
 *           description: Program name
 *         description:
 *           type: string
 *           description: Detailed program description
 *         duration:
 *           type: string
 *           description: Program duration (e.g., "8 weeks")
 *         price:
 *           type: number
 *           format: float
 *           description: Program price
 *         schedule:
 *           type: string
 *           description: Program schedule details
 *         category:
 *           type: string
 *           enum: [training, camp, clinic]
 *           description: Program category
 *         imageUrl:
 *           type: string
 *           format: uri
 *           description: URL to program image
 *         isActive:
 *           type: boolean
 *           description: Program availability status
 */

/**
 * @swagger
 * /api/v1/programs:
 *   get:
 *     summary: Get all programs
 *     tags: [Programs]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [training, camp, clinic]
 *         description: Filter by program category
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: List of programs
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
 *                     $ref: '#/components/schemas/Program'
 */
router.get( '/', programController.findAll.bind( programController ) );

/**
 * @swagger
 * /api/v1/programs/{id}:
 *   get:
 *     summary: Get program by ID
 *     tags: [Programs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Program ID
 *     responses:
 *       200:
 *         description: Program details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Program'
 *       404:
 *         description: Program not found
 */
router.get( '/:id', programController.findById.bind( programController ) );

/**
 * @swagger
 * /api/v1/programs/category/{category}:
 *   get:
 *     summary: Get programs by category
 *     tags: [Programs]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [training, camp, clinic]
 *         description: Program category
 *     responses:
 *       200:
 *         description: List of programs in category
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
 *                     $ref: '#/components/schemas/Program'
 */
router.get( '/category/:category', programController.findByCategory.bind( programController ) );

// Protected routes
router.use( authenticate );
router.use( authorize( 'admin' ) );

/**
 * @swagger
 * /api/v1/programs:
 *   post:
 *     summary: Create a new program
 *     tags: [Programs]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: string
 *               price:
 *                 type: number
 *               schedule:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [training, camp, clinic]
 *     responses:
 *       201:
 *         description: Program created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Program'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires admin role
 */
router.post( '/',
    upload.single( 'image' ),
    programController.create.bind( programController )
);

router.put( '/:id',
    upload.single( 'image' ),
    programController.update.bind( programController )
);

router.delete( '/:id', programController.delete.bind( programController ) );

export { router as programRoutes };
