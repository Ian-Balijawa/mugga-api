import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Loan } from './loan.entity';
import { Borrower } from './borrower.entity';
import { Guarantor } from './guarantor.entity';
import { Collateral } from './collateral.entity';
import { LoanOfficer } from './loan-officer.entity';
import { BorrowerGroup } from './borrower-group.entity';

export enum DocumentType {
    IDENTIFICATION = 'identification',
    PROOF_OF_ADDRESS = 'proof_of_address',
    BANK_STATEMENT = 'bank_statement',
    PAYSLIP = 'payslip',
    TAX_RETURN = 'tax_return',
    BUSINESS_LICENSE = 'business_license',
    FINANCIAL_STATEMENT = 'financial_statement',
    COLLATERAL_DOCUMENT = 'collateral_document',
    LOAN_AGREEMENT = 'loan_agreement',
    GUARANTOR_DOCUMENT = 'guarantor_document',
    INSURANCE_POLICY = 'insurance_policy',
    OTHER = 'other'
}

export enum DocumentStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    EXPIRED = 'expired',
    ARCHIVED = 'archived'
}

export enum DocumentCategory {
    KYC = 'kyc',
    FINANCIAL = 'financial',
    LEGAL = 'legal',
    COLLATERAL = 'collateral',
    LOAN = 'loan',
    INSURANCE = 'insurance',
    OTHER = 'other'
}

@Entity( 'documents' )
export class Document extends BaseEntity {
    @Column()
    name: string;

    @Column( {
        type: 'enum',
        enum: DocumentType
    } )
    type: DocumentType;

    @Column( {
        type: 'enum',
        enum: DocumentCategory
    } )
    category: DocumentCategory;

    @Column()
    url: string;

    @Column( { type: 'text', nullable: true } )
    description?: string;

    @Column( { nullable: true } )
    mimeType?: string;

    @Column( { nullable: true } )
    size?: number;

    @Column( { type: 'json', nullable: true } )
    metadata?: {
        originalName?: string;
        encoding?: string;
        dimensions?: {
            width?: number;
            height?: number;
        };
        pages?: number;
        duration?: number;
        location?: {
            bucket?: string;
            key?: string;
        };
    };

    @Column( {
        type: 'enum',
        enum: DocumentStatus,
        default: DocumentStatus.PENDING
    } )
    status: DocumentStatus;

    @Column( { type: 'date', nullable: true } )
    expiryDate?: Date;

    @Column( { type: 'text', nullable: true } )
    rejectionReason?: string;

    @Column( { type: 'json', nullable: true } )
    validationResults?: {
        isValid: boolean;
        errors?: string[];
        warnings?: string[];
    };

    @Index()
    @ManyToOne( () => Loan, { nullable: true } )
    loan?: Loan;

    @Index()
    @ManyToOne( () => Borrower, { nullable: true } )
    borrower?: Borrower;

    @Index()
    @ManyToOne( () => Guarantor, { nullable: true } )
    guarantor?: Guarantor;

    @Index()
    @ManyToOne( () => Collateral, { nullable: true } )
    collateral?: Collateral;

    @Index()
    @ManyToOne( () => LoanOfficer, { nullable: true } )
    loanOfficer?: LoanOfficer;

    @Index()
    @ManyToOne( () => BorrowerGroup, { nullable: true } )
    borrowerGroup?: BorrowerGroup;
}
