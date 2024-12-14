import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Loan } from './loan.entity';
import { Borrower } from './borrower.entity';
import { LoanOfficer } from './loan-officer.entity';
import { Guarantor } from './guarantor.entity';
import { User } from './user.entity';
import { BorrowerGroup } from './borrower-group.entity';

export enum CommentableType {
  LOAN = 'loan',
  BORROWER = 'borrower',
  LOAN_OFFICER = 'loan_officer',
  GUARANTOR = 'guarantor',
  BORROWER_GROUP = 'borrower_group'
}

@Entity( 'comments' )
export class Comment extends BaseEntity {
  @Column( 'text' )
  content: string;

  @Column( {
    type: 'enum',
    enum: CommentableType
  } )
  commentableType: CommentableType;

  @Index()
  @Column()
  commentableId: string;

  @Index()
  @ManyToOne( () => User )
  commentAuthor: User;

  @Column()
  authorType: 'loan_officer' | 'borrower';

  // Polymorphic relationships
  @Index()
  @ManyToOne( () => Loan, loan => loan.comments, {
    nullable: true,
    onDelete: 'CASCADE'
  } )
  loan: Loan;

  @Index()
  @ManyToOne( () => Borrower, borrower => borrower.comments, {
    nullable: true,
    onDelete: 'CASCADE'
  } )
  borrower: Borrower;

  @Index()
  @ManyToOne( () => LoanOfficer, loanOfficer => loanOfficer.comments, {
    nullable: true,
    onDelete: 'CASCADE'
  } )
  loanOfficer: LoanOfficer;

  @Index()
  @ManyToOne( () => Guarantor, guarantor => guarantor.comments, {
    nullable: true,
    onDelete: 'CASCADE'
  } )
  guarantor: Guarantor;

  @Index()
  @ManyToOne( () => BorrowerGroup, group => group.comments )
  borrowerGroup: BorrowerGroup;
}
