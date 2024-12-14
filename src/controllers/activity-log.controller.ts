import { Request, Response } from 'express';
import { ActivityLogService } from '../services/activity-log.service';
import { ActivityType } from '../entities/activity-log.entity';

export class ActivityLogController {
    private activityLogService = new ActivityLogService();

    async fetchLogs(req: Request, res: Response): Promise<void> {
        const {
            page,
            limit,
            startDate,
            endDate,
            type,
            entityType,
            entityId,
            userId
        } = req.query;

        const logs = await this.activityLogService.fetchLogs({
            page: page ? parseInt(page as string) : undefined,
            limit: limit ? parseInt(limit as string) : undefined,
            startDate: startDate ? new Date(startDate as string) : undefined,
            endDate: endDate ? new Date(endDate as string) : undefined,
            type: type as ActivityType,
            entityType: entityType as string,
            entityId: entityId as string,
            userId: userId as string
        });

        res.json(logs);
    }

    async getRecentLogs(req: Request, res: Response): Promise<void> {
        const { limit } = req.query;
        const logs = await this.activityLogService.getRecentLogs(
            limit ? parseInt(limit as string) : undefined
        );
        res.json(logs);
    }

    async getEntityHistory(req: Request, res: Response): Promise<void> {
        const { entityType, entityId } = req.params;
        const logs = await this.activityLogService.getEntityHistory(
            entityType,
            entityId
        );
        res.json(logs);
    }

    async getUserActivity(req: Request, res: Response): Promise<void> {
        const { limit } = req.query;
        const logs = await this.activityLogService.getUserActivity(
            req.user!.userId,
            limit ? parseInt(limit as string) : undefined
        );
        res.json(logs);
    }
}
