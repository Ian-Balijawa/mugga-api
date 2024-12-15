import { Router } from 'express';
import { StatsController } from '../controllers/stats.controller';

const router = Router();
const statsController = new StatsController();

/**
 * @swagger
 * components:
 *   schemas:
 *     ActivityLog:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         type:
 *           type: string
 *           enum: [create, update, delete]
 *         description:
 *           type: string
 *         entityType:
 *           type: string
 *         entityId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             email:
 *               type: string
 */

/**
 * @swagger
 * /api/v1/stats:
 *   get:
 *     summary: Get system statistics and recent activities
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: System statistics and recent activities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     counts:
 *                       type: object
 *                       properties:
 *                         coaches:
 *                           type: number
 *                         facilities:
 *                           type: number
 *                         programs:
 *                           type: number
 *                         posts:
 *                           type: number
 *                         registrations:
 *                           type: number
 *                         galleryItems:
 *                           type: number
 *                         activePrograms:
 *                           type: number
 *                     recentActivities:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ActivityLog'
 */
router.get( '/', statsController.getStats.bind( statsController ) );

export { router as statsRoutes };
