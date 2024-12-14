import { Entity, Column, OneToOne, JoinColumn, OneToMany, Index, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Borrower } from './borrower.entity';
import { Guarantor } from './guarantor.entity';
import { Loan } from './loan.entity';
import { Comment } from './comment.entity';
import { BorrowerGroup } from './borrower-group.entity';
import { Document } from './document.entity';
import { Branch } from './branch.entity';

@Entity( 'loan_officers' )
export class LoanOfficer extends BaseEntity {
  @Index()
  @OneToOne( () => User )
  @JoinColumn()
  user: User;

  @Column( { default: false } )
  isAdmin: boolean;

  @Column( { default: false } )
  isActive: boolean;

  @Index()
  @Column( { unique: true } )
  employeeId: string;

  @OneToMany( () => Borrower, borrower => borrower.loanOfficer, {
    eager: true
  } )
  borrowers: Borrower[];

  @OneToMany( () => Loan, loan => loan.loanOfficer )
  loans: Loan[];

  @OneToMany( () => BorrowerGroup, group => group.loanOfficer )
  borrowerGroups: BorrowerGroup[];

  @OneToMany( () => Guarantor, guarantor => guarantor.loanOfficer )
  guarantors: Guarantor[];

  @OneToMany( () => Comment, comment => comment.loanOfficer )
  comments: Comment[];

  @OneToMany( () => Document, document => document.loanOfficer )
  documents: Document[];

  @ManyToOne( () => Branch, branch => branch.loanOfficers )
  branch: Branch;
}
