import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import multer from 'multer';
import { CoachController } from '../controllers/coach.controller';

const router = Router();
const coachController = new CoachController();
const upload = multer( { storage: multer.memoryStorage() } );

/**
 * @swagger
 * components:
 *   schemas:
 *     Coach:
 *       type: object
 *       required:
 *         - name
 *         - role
 *         - bio
 *         - specialties
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Auto-generated coach ID
 *         name:
 *           type: string
 *           description: Coach's full name
 *         role:
 *           type: string
 *           description: Coach's role/position
 *         bio:
 *           type: string
 *           description: Coach's biography
 *         imageUrl:
 *           type: string
 *           format: uri
 *           description: URL to coach's profile image
 *         specialties:
 *           type: array
 *           items:
 *             type: string
 *           description: List of coach's specialties
 *         userId:
 *           type: string
 *           format: uuid
 *           description: Associated user account ID
 */

/**
 * @swagger
 * /api/v1/coaches:
 *   get:
 *     summary: Get all coaches
 *     tags: [Coaches]
 *     responses:
 *       200:
 *         description: List of coaches
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
 *                     $ref: '#/components/schemas/Coach'
 */
router.get( '/', coachController.findAll.bind( coachController ) );

/**
 * @swagger
 * /api/v1/coaches/{id}:
 *   get:
 *     summary: Get coach by ID
 *     tags: [Coaches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Coach ID
 *     responses:
 *       200:
 *         description: Coach details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Coach'
 *       404:
 *         description: Coach not found
 */
router.get( '/:id', coachController.findById.bind( coachController ) );

// Protected routes
router.use( authenticate );
router.use( authorize( 'admin' ) );

/**
 * @swagger
 * /api/v1/coaches:
 *   post:
 *     summary: Create a new coach profile
 *     tags: [Coaches]
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
 *               role:
 *                 type: string
 *               bio:
 *                 type: string
 *               specialties:
 *                 type: array
 *                 items:
 *                   type: string
 *               userId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Coach profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Coach'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires admin role
 */
router.post( '/',
    upload.single( 'image' ),
    coachController.create.bind( coachController )
);

/**
 * @swagger
 * /api/v1/coaches/{id}:
 *   put:
 *     summary: Update a coach profile
 *     tags: [Coaches]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Coach ID
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
 *               role:
 *                 type: string
 *               bio:
 *                 type: string
 *               specialties:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Coach profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Coach'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires admin role
 *       404:
 *         description: Coach not found
 */
router.put( '/:id',
    upload.single( 'image' ),
    coachController.update.bind( coachController )
);

/**
 * @swagger
 * /api/v1/coaches/{id}:
 *   delete:
 *     summary: Delete a coach profile
 *     tags: [Coaches]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Coach ID
 *     responses:
 *       204:
 *         description: Coach profile deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires admin role
 *       404:
 *         description: Coach not found
 */
router.delete( '/:id', coachController.delete.bind( coachController ) );

export { router as coachRoutes };
