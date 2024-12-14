import { Router } from 'express';
import { DocumentController } from '../controllers/document.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { createRequestValidator } from '../middlewares/request-validator.middleware';
import { z } from 'zod';
import { DocumentStatus, DocumentType, DocumentCategory } from '../entities/document.entity';

const router = Router();
const documentController = new DocumentController();

// Validation schemas
const uploadSchema = z.object({
    name: z.string(),
    type: z.nativeEnum(DocumentType),
    category: z.nativeEnum(DocumentCategory),
    description: z.string().optional()
});

const statusUpdateSchema = z.object({
    status: z.nativeEnum(DocumentStatus),
    rejectionReason: z.string().optional()
});

const validationSchema = z.object({
    validationResults: z.object({
        isValid: z.boolean(),
        errors: z.array(z.string()).optional(),
        warnings: z.array(z.string()).optional()
    })
});

// All routes require authentication
router.use(authenticate);

// Upload routes for different entity types
router.post(
    '/:entityType/:entityId/upload',
    authorize('loan_officer', 'admin'),
    (req, res, next) => {
        const uploadMiddleware = documentController.getUploadMiddleware(req.params.entityType);
        uploadMiddleware(req, res, (err) => {
            if (err) {
                next(err);
                return;
            }
            next();
        });
    },
    createRequestValidator({ body: uploadSchema }),
    (req, res) => documentController.upload(req, res)
);

// Download document
router.get(
    '/:id/download',
    (req, res) => documentController.download(req, res)
);

// View document
router.get(
    '/:id/view',
    (req, res) => documentController.view(req, res)
);

// Delete document
router.delete(
    '/:id',
    authorize('loan_officer', 'admin'),
    (req, res) => documentController.delete(req, res)
);

// Update document status
router.patch(
    '/:id/status',
    authorize('loan_officer', 'admin'),
    createRequestValidator({ body: statusUpdateSchema }),
    (req, res) => documentController.updateStatus(req, res)
);

// Get documents by entity
router.get(
    '/:entityType/:entityId',
    (req, res) => documentController.findByEntity(req, res)
);

// Validate document
router.post(
    '/:id/validate',
    authorize('loan_officer', 'admin'),
    createRequestValidator({ body: validationSchema }),
    (req, res) => documentController.validate(req, res)
);

export { router as documentRoutes };
