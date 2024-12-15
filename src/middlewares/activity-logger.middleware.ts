import { Request, Response, NextFunction } from 'express';
import { ActivityLogService } from '../services/activity-log.service';
import { ActivityType } from '../entities/activity-log.entity';
import { Logger } from '../utils/logger';
import { UserService } from '../services/user.service';

const activityLogService = new ActivityLogService();
const userService = new UserService();

export function logActivity( entityType: string ) {
    return async ( req: Request, res: Response, next: NextFunction ) => {
        const originalJson = res.json;
        res.json = function ( body: any ) {
            const userContext = req.user;
            
            ( async () => {
                let user = null;
                if (userContext) {
                    user = await userService.findById( userContext.userId );
                }

                const method = req.method;
                let type: ActivityType;
                let description: string;
                let entityId: string | undefined;

                switch ( method ) {
                    case 'POST':
                        type = ActivityType.CREATE;
                        description = `Created new ${entityType}`;
                        entityId = body.data?.id;
                        await activityLogService.logEntityChange(
                            type,
                            entityType,
                            entityId!,
                            description,
                            null,
                            body.data,
                            user,
                            req
                        );
                        break;

                    case 'PUT':
                    case 'PATCH':
                        type = ActivityType.UPDATE;
                        entityId = req.params.id;
                        description = `Updated ${entityType} #${entityId}`;
                        await activityLogService.logEntityChange(
                            type,
                            entityType,
                            entityId,
                            description,
                            req.body,
                            body.data,
                            user,
                            req
                        );
                        break;

                    case 'DELETE':
                        type = ActivityType.DELETE;
                        entityId = req.params.id;
                        description = `Deleted ${entityType} #${entityId}`;
                        await activityLogService.logEntityChange(
                            type,
                            entityType,
                            entityId,
                            description,
                            req.body,
                            null,
                            user,
                            req
                        );
                        break;
                }
            } )().catch( err => Logger.error( 'Activity logging error:', err ) );

            return originalJson.call( this, body );
        };
        next();
    };
}
