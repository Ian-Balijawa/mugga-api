import { Router } from 'express';
import { ActivityLogController } from '../controllers/activity-log.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();
const activityLogController = new ActivityLogController();

// All routes require authentication
router.use(authenticate);

// Admin routes
router.get(
    '/logs',
    authorize('admin'),
    (req, res) => activityLogController.fetchLogs(req, res)
);

router.get(
    '/recent',
    authorize('admin'),
    (req, res) => activityLogController.getRecentLogs(req, res)
);

// Entity history - accessible by loan officers and admins
router.get(
    '/:entityType/:entityId',
    authorize('admin', 'loan_officer'),
    (req, res) => activityLogController.getEntityHistory(req, res)
);

// User's own activity
router.get(
    '/my-activity',
    (req, res) => activityLogController.getUserActivity(req, res)
);

export { router as activityLogRoutes };
