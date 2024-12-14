import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Loan } from './loan.entity';

export enum FeeType {
    PROCESSING = 'processing',
    ADMINISTRATION = 'administration',
    INSURANCE = 'insurance',
    LEGAL = 'legal',
    DISBURSEMENT = 'disbursement',
    LATE_PAYMENT = 'late_payment',
    EARLY_REPAYMENT = 'early_repayment',
    COMMITMENT = 'commitment',
    DOCUMENTATION = 'documentation',
    OTHER = 'other'
}

export enum FeeCalculationType {
    FIXED = 'fixed',
    PERCENTAGE = 'percentage'
}

@Entity('fees')
export class Fee extends BaseEntity {
    @Column({
        type: 'enum',
        enum: FeeType
    })
    type: FeeType;

    @Column()
    name: string;

    @Column({
        type: 'enum',
        enum: FeeCalculationType
    })
    calculationType: FeeCalculationType;

    @Column('decimal', { precision: 10, scale: 2 })
    value: number;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ default: true })
    isActive: boolean;

    @Index()
    @ManyToOne(() => Loan, loan => loan.fees, {
        onDelete: 'CASCADE'
    })
    loan: Loan;
}
