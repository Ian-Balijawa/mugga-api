import { Entity, Column, ManyToOne, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Borrower } from './borrower.entity';
import { LoanOfficer } from './loan-officer.entity';
import { Comment } from './comment.entity';
import { Fee } from './fee.entity';
import { Collateral } from './collateral.entity';
import { Payment } from './payment.entity';
import { Document } from './document.entity';
import { Branch } from './branch.entity';

export enum LoanType {
  PERSONAL = 'personal',
  STUDENT = 'student',
  PENSIONER = 'pensioner',
  BUSINESS = 'business',
  GROUP_LOAN = 'group_loan',
  SALARY_LOAN = 'salary_loan',
  OVERSEAS_WORKER = 'overseas_worker'
}

export enum DisbursementMethod {
  CASH = 'cash',
  MOBILE_MONEY = 'mobile_money',
  CHEQUE = 'cheque',
  WIRE_TRANSFER = 'wire_transfer'
}

export enum LoanStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DISBURSED = 'disbursed',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  DEFAULTED = 'defaulted'
}

export enum InterestMethod {
  FLAT_RATE = 'flat_rate',
  REDUCING_BALANCE_EQUAL_INSTALLMENTS = 'reducing_balance_equal_installments',
  REDUCING_BALANCE_EQUAL_PRINCIPAL = 'reducing_balance_equal_principal',
  INTEREST_ONLY = 'interest_only',
  COMPOUND_INTEREST = 'compound_interest'
}

export enum DurationUnit {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year'
}

export enum RepaymentCycle {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  BIMONTHLY = 'bimonthly',
  QUARTERLY = 'quarterly',
  FOUR_MONTHLY = 'four_monthly',
  SEMI_ANNUAL = 'semi_annual',
  NINE_MONTHLY = 'nine_monthly',
  YEARLY = 'yearly',
  LUMP_SUM = 'lump_sum'
}

@Entity( 'loans' )
export class Loan extends BaseEntity {
  @Index()
  @Column( { unique: true } )
  loanNumber: string;

  @Column( {
    type: 'enum',
    enum: LoanType,
    enumName: 'loan_type_enum'
  } )
  type: LoanType;

  @Column( {
    type: 'enum',
    enum: LoanStatus,
    default: LoanStatus.PENDING
  } )
  status: LoanStatus;

  @Column( {
    type: 'enum',
    enum: DisbursementMethod
  } )
  disbursementMethod: DisbursementMethod;

  @Index()
  @ManyToOne( () => Borrower, borrower => borrower.loans )
  borrower: Borrower;

  @Column( 'decimal', { precision: 10, scale: 2 } )
  principalAmount: number;

  @Column( { type: 'timestamp' } )
  releaseDate: Date;

  @Column( {
    type: 'enum',
    enum: InterestMethod
  } )
  interestMethod: InterestMethod;

  @Column( 'json' )
  loanInterest: {
    value: number;
    unit: DurationUnit;
  };

  @Column( 'json' )
  loanDuration: {
    value: number;
    unit: DurationUnit;
  };

  @Column( {
    type: 'enum',
    enum: RepaymentCycle
  } )
  repaymentCycle: RepaymentCycle;

  @Column()
  numberOfRepayments: number;

  @Index()
  @ManyToOne( () => LoanOfficer, loanOfficer => loanOfficer.loans )
  loanOfficer: LoanOfficer;

  @Index()
  @ManyToOne( () => Branch, branch => branch.loans )
  branch: Branch;

  @OneToMany( () => Comment, comment => comment.loan )
  comments: Comment[];

  @Column( { type: 'timestamp' } )
  maturityDate: Date;

  @Column( { type: 'timestamp', nullable: true } )
  nextPaymentDate: Date;

  @Column( 'decimal', { precision: 10, scale: 2, default: 0 } )
  totalFees: number;

  @Column( 'decimal', { precision: 10, scale: 2, default: 0 } )
  totalPaid: number;

  @Column( 'decimal', { precision: 10, scale: 2, default: 0 } )
  totalAmount: number;

  @OneToMany( () => Fee, fee => fee.loan, {
    cascade: true,
    eager: true
  } )
  fees: Fee[];

  @OneToMany( () => Collateral, collateral => collateral.loan, {
    cascade: true,
    eager: true
  } )
  collaterals: Collateral[];

  @OneToMany( () => Payment, payment => payment.loan, {
    cascade: true
  } )
  payments: Payment[];

  @OneToMany( () => Document, document => document.loan )
  documents: Document[];
}
