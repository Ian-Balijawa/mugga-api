import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

export enum ActivityType {
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    LOGIN = 'login',
    LOGOUT = 'logout',
    PASSWORD_CHANGE = 'password_change',
    STATUS_CHANGE = 'status_change',
    PAYMENT = 'payment',
    DOCUMENT_UPLOAD = 'document_upload',
    OTHER = 'other'
}

@Entity('activity_logs')
export class ActivityLog extends BaseEntity {
    @Column({
        type: 'enum',
        enum: ActivityType
    })
    type: ActivityType;

    @Column()
    description: string;

    @Column()
    entityType: string;

    @Column({ nullable: true })
    entityId?: string;

    @Column({ type: 'json', nullable: true })
    oldValues?: Record<string, any>;

    @Column({ type: 'json', nullable: true })
    newValues?: Record<string, any>;

    @Column({ type: 'json', nullable: true })
    metadata?: Record<string, any>;

    @Column({ nullable: true })
    ipAddress?: string;

    @Column({ nullable: true })
    userAgent?: string;

    @Index()
    @ManyToOne(() => User)
    user: User;
}
