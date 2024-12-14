import { Entity, Column, ManyToOne, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { LoanOfficer } from './loan-officer.entity';
import { Loan } from './loan.entity';
import { Guarantor } from './guarantor.entity';
import { Comment } from './comment.entity';
import { BorrowerGroup } from './borrower-group.entity';
import { Document } from './document.entity';

export enum Title {
  MR = 'Mr.',
  MRS = 'Mrs.',
  MISS = 'Miss',
  MS = 'Ms.',
  DR = 'Dr.',
  PROF = 'Prof.',
  REV = 'Rev.'
}

export enum WorkingStatus {
  EMPLOYEE = 'Employee',
  GOVERNMENT_EMPLOYEE = 'Government Employee',
  PRIVATE_SECTOR_EMPLOYEE = 'Private Sector Employee',
  OWNER = 'Owner',
  STUDENT = 'Student',
  OVERSEAS_WORKER = 'Overseas Worker',
  PENSIONER = 'Pensioner',
  UNEMPLOYED = 'Unemployed'
}

@Entity( 'borrowers' )
export class Borrower extends BaseEntity {
  @Column()
  country: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column( { nullable: true } )
  middleName?: string;

  @Column( { nullable: true } )
  businessName?: string;

  @Index()
  @Column( { unique: true } )
  uniqueNumber: string;

  @Column()
  gender: string;

  @Column( {
    type: 'enum',
    enum: Title
  } )
  title: Title;

  @Index()
  @Column()
  phone: string;

  @Index()
  @Column()
  email: string;

  @Column( { type: 'date' } )
  dateOfBirth: Date;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  province: string;

  @Column( {
    type: 'enum',
    enum: WorkingStatus,
    enumName: 'borrower_working_status'
  } )
  workingStatus: WorkingStatus;

  @Column( { type: 'decimal', precision: 5, scale: 2, nullable: true } )
  creditScore?: number;

  @Column( { nullable: true } )
  borrowerPhoto?: string;

  @Column( { type: 'text', nullable: true } )
  description?: string;

  @Column( 'simple-array', { nullable: true } )
  borrowerFiles?: string[];

  @Index()
  @ManyToOne( () => LoanOfficer, loanOfficer => loanOfficer.borrowers )
  loanOfficer: LoanOfficer;

  @OneToMany( () => Loan, loan => loan.borrower, {
    cascade: true,
    eager: true
  } )
  loans: Loan[];

  @OneToMany( () => Guarantor, guarantor => guarantor.borrower, {
    cascade: true,
    eager: true
  } )
  guarantors: Guarantor[];

  @OneToMany( () => Comment, comment => comment.borrower )
  comments: Comment[];

  @Index()
  @ManyToOne( () => BorrowerGroup, group => group.borrowers )
  borrowerGroup: BorrowerGroup;

  @OneToMany( () => Document, document => document.borrower )
  documents: Document[];
}
