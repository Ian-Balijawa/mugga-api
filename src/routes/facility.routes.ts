import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { FacilityController } from '../controllers/facility.controller';

const router = Router();
const facilityController = new FacilityController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Facility:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - features
 *         - equipment
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Auto-generated facility ID
 *         name:
 *           type: string
 *           description: Name of the facility
 *         description:
 *           type: string
 *           description: Detailed description of the facility
 *         features:
 *           type: array
 *           items:
 *             type: string
 *           description: List of facility features
 *         imageUrl:
 *           type: string
 *           format: uri
 *           description: URL to facility image
 *         equipment:
 *           type: array
 *           items:
 *             type: string
 *           description: List of available equipment
 */

/**
 * @swagger
 * /api/v1/facilities:
 *   get:
 *     summary: Get all facilities
 *     tags: [Facilities]
 *     responses:
 *       200:
 *         description: List of facilities
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
 *                     $ref: '#/components/schemas/Facility'
 */
router.get( '/', facilityController.findAll.bind( facilityController ) );

/**
 * @swagger
 * /api/v1/facilities/{id}:
 *   get:
 *     summary: Get facility by ID
 *     tags: [Facilities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Facility ID
 *     responses:
 *       200:
 *         description: Facility details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Facility'
 *       404:
 *         description: Facility not found
 */
router.get( '/:id', facilityController.findById.bind( facilityController ) );

// Protected routes
router.use( authenticate );
router.use( authorize( 'admin' ) );

/**
 * @swagger
 * /api/v1/facilities:
 *   post:
 *     summary: Create a new facility
 *     tags: [Facilities]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - features
 *               - imageUrl
 *               - equipment
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *               equipment:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Facility created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Facility'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires admin role
 */
router.post( '/', facilityController.create.bind( facilityController ) );

/**
 * @swagger
 * /api/v1/facilities/{id}:
 *   put:
 *     summary: Update a facility
 *     tags: [Facilities]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Facility ID
 *     requestBody:
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
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               equipment:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Facility updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Facility'
 */
router.put( '/:id', facilityController.update.bind( facilityController ) );

/**
 * @swagger
 * /api/v1/facilities/{id}:
 *   delete:
 *     summary: Delete a facility
 *     tags: [Facilities]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Facility ID
 *     responses:
 *       204:
 *         description: Facility deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires admin role
 *       404:
 *         description: Facility not found
 */
router.delete( '/:id', facilityController.delete.bind( facilityController ) );

export { router as facilityRoutes };
