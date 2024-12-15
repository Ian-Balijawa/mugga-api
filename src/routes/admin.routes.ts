import { Router } from 'express';

import { authenticate } from '../middlewares/auth.middleware';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Admin user email
 *         password:
 *           type: string
 *           format: password
 *           description: Admin user password
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               description: JWT access token
 *     UserProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         email:
 *           type: string
 *           format: email
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *     SignupRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - confirmPassword
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Admin user email
 *         password:
 *           type: string
 *           format: password
 *           minLength: 8
 *           description: Strong password required
 *         confirmPassword:
 *           type: string
 *           format: password
 *           description: Must match password
 */

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Invalid credentials
 *       429:
 *         description: Too many login attempts
 */
router.post( '/login',
    authController.login.bind( authController )
);

/**
 * @swagger
 * /api/admin/logout:
 *   post:
 *     summary: Admin logout
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.post( '/logout',
    authenticate,
    authController.logout.bind( authController )
);

/**
 * @swagger
 * /api/admin/me:
 *   get:
 *     summary: Get current admin profile
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized
 */
router.get( '/me',
    authenticate,
    authController.getCurrentUser.bind( authController )
);

/**
 * @swagger
 * /api/admin/signup:
 *   post:
 *     summary: Create new admin account
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       201:
 *         description: Admin account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only super admins can create new admins
 */
router.post( '/signup',
    authController.signup.bind( authController )
);

export { router as adminRoutes };
