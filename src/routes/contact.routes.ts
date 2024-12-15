import { Router } from 'express';
import { ContactController } from '../controllers/contact.controller';
import { createRateLimiter } from '../middlewares/rate-limiter.middleware';

const router = Router();
const contactController = new ContactController();

/**
 * @swagger
 * components:
 *   schemas:
 *     ContactForm:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - subject
 *         - message
 *       properties:
 *         name:
 *           type: string
 *           description: Sender's full name
 *         email:
 *           type: string
 *           format: email
 *           description: Sender's email address
 *         subject:
 *           type: string
 *           description: Message subject
 *         message:
 *           type: string
 *           description: Message content
 */

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Submit contact form
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactForm'
 *     responses:
 *       200:
 *         description: Contact form submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Contact form submitted successfully
 *       429:
 *         description: Too many submissions
 */
router.post( '/',
    createRateLimiter( {
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 5 // 5 submissions per hour
    } ),
    contactController.submitForm.bind( contactController )
);

export { router as contactRoutes };
