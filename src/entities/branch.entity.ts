import { Entity, Column, OneToMany, ManyToOne, Index, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base.entity';
import { LoanOfficer } from './loan-officer.entity';
import { Loan } from './loan.entity';
import { User } from './user.entity';
import { LoanType } from './loan-type.entity';

@Entity( 'branches' )
export class Branch extends BaseEntity {
    @Column()
    name: string;

    @Column()
    code: string;

    @Column()
    address: string;

    @Column()
    phone: string;

    @Column()
    email: string;

    @Column( 'decimal', { precision: 15, scale: 2 } )
    minimumLoanAmount: number;

    @Column( 'decimal', { precision: 15, scale: 2 } )
    maximumLoanAmount: number;

    @Column( 'decimal', { precision: 5, scale: 2 } )
    minimumInterestRate: number;

    @Column( 'decimal', { precision: 5, scale: 2 } )
    maximumInterestRate: number;

    @Index()
    @ManyToOne( () => User )
    manager: User;

    @ManyToMany( () => LoanType )
    @JoinTable( {
        name: 'branch_loan_types',
        joinColumn: { name: 'branch_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'loan_type_id', referencedColumnName: 'id' }
    } )
    allowedLoanTypes: LoanType[];

    @OneToMany( () => LoanOfficer, loanOfficer => loanOfficer.branch )
    loanOfficers: LoanOfficer[];

    @OneToMany( () => Loan, loan => loan.branch )
    loans: Loan[];

    @Column( { default: false } )
    isMainBranch: boolean;
}
