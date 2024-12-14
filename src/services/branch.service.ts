import { BaseService } from './base.service';
import { Branch } from '../entities/branch.entity';
import { AppDataSource } from '../config/database.config';
import { AppError } from '../middlewares/error-handler.middleware';
import { LoanType as LoanTypeEntity } from '../entities/loan-type.entity';
import { User } from '../entities/user.entity';
import { LoanType } from '../entities/loan.entity';

interface CreateBranchInput {
    name: string;
    code: string;
    address: string;
    phone: string;
    email: string;
    minimumLoanAmount: number;
    maximumLoanAmount: number;
    minimumInterestRate: number;
    maximumInterestRate: number;
    manager?: { id: string };
    allowedLoanTypes: { id: string }[];
}

export class BranchService extends BaseService<Branch> {
    constructor() {
        super( AppDataSource.getRepository( Branch ) );
    }

    async create( data: CreateBranchInput ): Promise<Branch> {
        const branchCount = await this.repository.count();
        const branch = this.repository.create( {
            ...data,
            isMainBranch: branchCount === 0,
            manager: data.manager ? { id: data.manager.id } as User : undefined,
            allowedLoanTypes: data.allowedLoanTypes.map( lt => ( { id: lt.id } ) as LoanTypeEntity )
        } );

        return this.repository.save( branch );
    }

    async validateLoanTypeForBranch( branchId: string, loanType: LoanType ): Promise<boolean> {
        const branch = await this.repository.findOne( {
            where: { id: branchId },
            relations: ['allowedLoanTypes']
        } );

        if ( !branch ) {
            throw new AppError( 404, 'Branch not found' );
        }

        return branch.allowedLoanTypes.some( allowedType => allowedType.type === loanType );
    }

    async validateLoanAmount( branchId: string, amount: number ): Promise<void> {
        const branch = await this.findById( branchId );

        if ( amount < branch.minimumLoanAmount || amount > branch.maximumLoanAmount ) {
            throw new AppError( 400, `Loan amount must be between ${branch.minimumLoanAmount} and ${branch.maximumLoanAmount}` );
        }
    }

    async validateInterestRate( branchId: string, rate: number ): Promise<void> {
        const branch = await this.findById( branchId );

        if ( rate < branch.minimumInterestRate || rate > branch.maximumInterestRate ) {
            throw new AppError( 400, `Interest rate must be between ${branch.minimumInterestRate}% and ${branch.maximumInterestRate}%` );
        }
    }

    async addLoanOfficer( branchId: string, loanOfficerId: string ): Promise<Branch> {
        const branch = await this.repository.findOne( {
            where: { id: branchId },
            relations: ['loanOfficers']
        } );

        if ( !branch ) {
            throw new AppError( 404, 'Branch not found' );
        }

        const loanOfficer = await AppDataSource.getRepository( 'LoanOfficer' ).findOne( {
            where: { id: loanOfficerId }
        } );

        if ( !loanOfficer ) {
            throw new AppError( 404, 'Loan officer not found' );
        }

        loanOfficer.branch = branch;
        await AppDataSource.getRepository( 'LoanOfficer' ).save( loanOfficer );

        return this.findById( branchId );
    }
}
