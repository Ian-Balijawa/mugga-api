import { BaseService } from './base.service';
import { ActivityLog, ActivityType } from '../entities/activity-log.entity';
import { AppDataSource } from '../config/database.config';
import { User } from '../entities/user.entity';
import { Request } from 'express';
import { Between, FindOptionsWhere } from 'typeorm';

interface LogActivityParams {
    type: ActivityType;
    description: string;
    entityType: string;
    entityId?: string;
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
    metadata?: Record<string, any>;
    user?: User;
    req?: Request;
}

interface FetchLogsParams {
    page?: number;
    limit?: number;
    startDate?: Date;
    endDate?: Date;
    type?: ActivityType;
    entityType?: string;
    entityId?: string;
    userId?: string;
}

interface FetchLogsResponse {
    logs: ActivityLog[];
    total: number;
    page: number;
    totalPages: number;
}

export class ActivityLogService extends BaseService<ActivityLog> {
    constructor() {
        super( AppDataSource.getRepository( ActivityLog ) );
    }

    async logActivity( {
        type,
        description,
        entityType,
        entityId,
        oldValues,
        newValues,
        metadata,
        user,
        req
    }: LogActivityParams ): Promise<ActivityLog> {
        const activityLog = await this.create( {
            type,
            description,
            entityType,
            entityId,
            oldValues,
            newValues,
            metadata,
            user,
            ipAddress: req?.ip,
            userAgent: req?.headers['user-agent']
        } );

        return activityLog;
    }

    async logEntityChange(
        type: ActivityType,
        entityType: string,
        entityId: string,
        description: string,
        oldValues: Record<string, any> | null,
        newValues: Record<string, any> | null,
        user: User | null,
        req?: Request
    ): Promise<ActivityLog> {
        return this.logActivity( {
            type,
            description,
            entityType,
            entityId,
            oldValues: oldValues || undefined,
            newValues: newValues || undefined,
            user: user || undefined,
            req
        } );
    }

    async logUserAction(
        type: ActivityType,
        description: string,
        user: User,
        metadata?: Record<string, any>,
        req?: Request
    ): Promise<ActivityLog> {
        return this.logActivity( {
            type,
            description,
            entityType: 'user',
            entityId: user.id,
            metadata,
            user,
            req
        } );
    }

    async findByEntity( entityType: string, entityId: string ): Promise<ActivityLog[]> {
        return this.repository.find( {
            where: { entityType, entityId },
            relations: ['user'],
            order: { createdAt: 'DESC' }
        } );
    }

    async findByUser( userId: string ): Promise<ActivityLog[]> {
        return this.repository.find( {
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' }
        } );
    }

    async fetchLogs( {
        page = 1,
        limit = 10,
        startDate,
        endDate,
        type,
        entityType,
        entityId,
        userId
    }: FetchLogsParams ): Promise<FetchLogsResponse> {
        const where: FindOptionsWhere<ActivityLog> = {};

        if ( startDate && endDate ) {
            where.createdAt = Between( startDate, endDate );
        }
        if ( type ) {
            where.type = type;
        }
        if ( entityType ) {
            where.entityType = entityType;
        }
        if ( entityId ) {
            where.entityId = entityId;
        }
        if ( userId ) {
            where.user = { id: userId };
        }

        const [logs, total] = await this.repository.findAndCount( {
            where,
            relations: ['user'],
            order: { createdAt: 'DESC' },
            skip: ( page - 1 ) * limit,
            take: limit
        } );

        return {
            logs,
            total,
            page,
            totalPages: Math.ceil( total / limit )
        };
    }

    async getRecentLogs( limit: number = 10 ): Promise<ActivityLog[]> {
        return this.repository.find( {
            relations: ['user'],
            order: { createdAt: 'DESC' },
            take: limit
        } );
    }

    async getEntityHistory( entityType: string, entityId: string ): Promise<ActivityLog[]> {
        return this.repository.find( {
            where: { entityType, entityId },
            relations: ['user'],
            order: { createdAt: 'DESC' }
        } );
    }

    async getUserActivity( userId: string, limit: number = 10 ): Promise<ActivityLog[]> {
        return this.repository.find( {
            where: { user: { id: userId } },
            relations: ['user'],
            order: { createdAt: 'DESC' },
            take: limit
        } );
    }
}
