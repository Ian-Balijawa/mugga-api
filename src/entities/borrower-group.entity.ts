import { Entity, Column, ManyToOne, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Borrower } from './borrower.entity';
import { LoanOfficer } from './loan-officer.entity';
import { Comment } from './comment.entity';
import { Document } from './document.entity';

export enum MeetingFrequency {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    BIWEEKLY = 'biweekly',
    MONTHLY = 'monthly',
    QUARTERLY = 'quarterly'
}

export enum GroupStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended',
    DISSOLVED = 'dissolved'
}

@Entity( 'borrower_groups' )
export class BorrowerGroup extends BaseEntity {
    @Column()
    name: string;

    @Index()
    @Column( { unique: true } )
    groupNumber: string;

    @Column( { default: 0 } )
    memberCount: number;

    @Column( { nullable: true } )
    groupLeader?: string;

    @Column( { nullable: true } )
    collectorName?: string;

    @Column( {
        type: 'enum',
        enum: MeetingFrequency,
        nullable: true
    } )
    meetingSchedule?: MeetingFrequency;

    @Column( {
        type: 'enum',
        enum: GroupStatus,
        default: GroupStatus.ACTIVE
    } )
    status: GroupStatus;

    @Column( { type: 'text', nullable: true } )
    description?: string;

    @Column( { type: 'json', nullable: true } )
    meetingDetails?: {
        day?: string;
        time?: string;
        location?: string;
        frequency?: MeetingFrequency;
    };

    @Index()
    @ManyToOne( () => LoanOfficer, loanOfficer => loanOfficer.borrowerGroups )
    loanOfficer: LoanOfficer;

    @OneToMany( () => Borrower, borrower => borrower.borrowerGroup )
    borrowers: Borrower[];

    @OneToMany( () => Comment, comment => comment.borrowerGroup )
    comments: Comment[];

    @OneToMany( () => Document, document => document.borrowerGroup )
    documents: Document[];
}
