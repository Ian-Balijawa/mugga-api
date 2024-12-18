import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { PostController } from '../controllers/post.controller';

const router = Router();
const postController = new PostController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - category
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Auto-generated post ID
 *         title:
 *           type: string
 *           description: Post title
 *         content:
 *           type: string
 *           description: Post content in HTML format
 *         imageUrl:
 *           type: string
 *           format: uri
 *           description: Featured image URL
 *         videoUrl:
 *           type: string
 *           format: uri
 *           description: Optional video URL
 *         category:
 *           type: string
 *           enum: [news, events, updates]
 *           description: Post category
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v1/posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: published
 *         schema:
 *           type: boolean
 *         description: Filter by publication status
 *     responses:
 *       200:
 *         description: List of posts
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
 *                     $ref: '#/components/schemas/Post'
 */
router.get( '/', postController.findAll.bind( postController ) );

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   get:
 *     summary: Get post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 */
router.get( '/:id', postController.findById.bind( postController ) );

// Protected routes
router.use( authenticate );
router.use( authorize( 'admin' ) );

/**
 * @swagger
 * /api/v1/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *               videoUrl:
 *                 type: string
 *                 format: uri
 *               category:
 *                 type: string
 *                 enum: [news, events, updates]
 */
router.post( '/',
    authenticate,
    authorize( 'admin' ),
    postController.create.bind( postController )
);

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   put:
 *     summary: Update a post
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Post ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               isPublished:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires admin role
 *       404:
 *         description: Post not found
 */
router.put( '/:id',
    postController.update.bind( postController )
);

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Post ID
 *     responses:
 *       204:
 *         description: Post deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires admin role
 *       404:
 *         description: Post not found
 */
router.delete( '/:id', postController.delete.bind( postController ) );

/**
 * @swagger
 * /api/v1/posts/{id}/restore:
 *   post:
 *     summary: Restore a soft-deleted post
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post restored successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires admin role
 *       404:
 *         description: Post not found
 */
router.post( '/:id/restore',
    authenticate,
    authorize( 'admin' ),
    postController.restore.bind( postController )
);

export { router as postRoutes };
