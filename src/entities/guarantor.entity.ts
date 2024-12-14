import { Entity, Column, ManyToOne, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Borrower, Title, WorkingStatus } from './borrower.entity';
import { LoanOfficer } from './loan-officer.entity';
import { Comment } from './comment.entity';
import { Document } from './document.entity';

export enum RelationshipType {
    FAMILY = 'family',
    FRIEND = 'friend',
    COLLEAGUE = 'colleague',
    EMPLOYER = 'employer',
    BUSINESS_PARTNER = 'business_partner'
}

@Entity( 'guarantors' )
export class Guarantor extends BaseEntity {
    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    middleName: string;

    @Column( {
        type: 'enum',
        enum: Title,
        enumName: 'title_enum',
    } )
    title: Title;

    @Index()
    @Column( { unique: true } )
    ninNo: string;

    @Column()
    occupation: string;

    @Column( {
        type: 'enum',
        enum: WorkingStatus,
        enumName: 'working_status_enum',
    } )
    workingStatus: WorkingStatus;

    @Column( {
        type: 'enum',
        enum: RelationshipType
    } )
    relationshipType: RelationshipType;

    @Index()
    @Column()
    phone: string;

    @Index()
    @Column()
    email: string;

    @Column()
    address: string;

    @Index()
    @ManyToOne( () => Borrower, borrower => borrower.guarantors )
    borrower: Borrower;

    @Index()
    @ManyToOne( () => LoanOfficer, loanOfficer => loanOfficer.guarantors )
    loanOfficer: LoanOfficer;

    @OneToMany( () => Comment, comment => comment.guarantor )
    comments: Comment[];

    @OneToMany( () => Document, document => document.guarantor )
    documents: Document[];
}
