import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Loan } from './loan.entity';

export enum PaymentStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
    REVERSED = 'reversed'
}

export enum PaymentMethod {
    CASH = 'cash',
    BANK_TRANSFER = 'bank_transfer',
    MOBILE_MONEY = 'mobile_money',
    CHEQUE = 'cheque',
    CARD = 'card'
}

@Entity('payments')
export class Payment extends BaseEntity {
    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column('decimal', { precision: 10, scale: 2 })
    principalAmount: number;

    @Column('decimal', { precision: 10, scale: 2 })
    interestAmount: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    penaltyAmount: number;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING
    })
    status: PaymentStatus;

    @Column({
        type: 'enum',
        enum: PaymentMethod
    })
    method: PaymentMethod;

    @Column({ nullable: true })
    transactionReference?: string;

    @Column({ type: 'json', nullable: true })
    metadata?: Record<string, any>;

    @Index()
    @ManyToOne(() => Loan, loan => loan.payments, { onDelete: 'CASCADE' })
    loan: Loan;
}
