import { BaseService } from './base.service';
import { Loan, LoanStatus } from '../entities/loan.entity';
import { AppDataSource } from '../config/database.config';
import { AppError } from '../middlewares/error-handler.middleware';
import { addDays } from 'date-fns';
import { BranchService } from './branch.service';
import { DeepPartial } from 'typeorm';
import { NotificationService } from './notification.service';

export class LoanService extends BaseService<Loan> {
  private branchService: BranchService;
  private notificationService: NotificationService;

  constructor() {
    super( AppDataSource.getRepository( Loan ) );
    this.branchService = new BranchService();
    this.notificationService = new NotificationService();
  }

  async create( data: DeepPartial<Loan> ): Promise<Loan> {
    if ( !data.branch?.id ) {
      throw new AppError( 400, 'Branch ID is required' );
    }

    if ( !data.loanOfficer?.id ) {
      throw new AppError( 400, 'Loan Officer ID is required' );
    }

    if ( !data.principalAmount ) {
      throw new AppError( 400, 'Principal amount is required' );
    }

    if ( !data.loanInterest?.value ) {
      throw new AppError( 400, 'Loan interest value is required' );
    }

    if ( !data.type ) {
      throw new AppError( 400, 'Loan type is required' );
    }

    // Validate branch-specific constraints
    await this.branchService.validateLoanAmount( data.branch.id, data.principalAmount );
    await this.branchService.validateInterestRate( data.branch.id, data.loanInterest.value );
    await this.branchService.validateLoanTypeForBranch( data.branch.id, data.type );

    // Validate loan officer belongs to branch
    const loanOfficer = await AppDataSource.getRepository( 'LoanOfficer' ).findOne( {
      where: {
        id: data.loanOfficer.id,
        branch: { id: data.branch.id }
      }
    } );

    if ( !loanOfficer && !data.loanOfficer.isAdmin ) {
      throw new AppError( 400, 'Loan officer does not belong to this branch' );
    }

    // Generate unique loan number and create loan
    data.loanNumber = await this.generateLoanNumber();
    const loan = await super.create( data );
    await this.notificationService.notifyLoanApplication( loan );
    return loan;
  }

  async updateStatus( id: string, status: LoanStatus ): Promise<Loan> {
    const loan = await this.findById( id );

    // Add business logic for status transitions
    if ( loan.status === LoanStatus.REJECTED && status !== LoanStatus.PENDING ) {
      throw new AppError( 400, 'Cannot modify rejected loan' );
    }

    return this.update( id, { status } );
  }

  private async generateLoanNumber(): Promise<string> {
    const prefix = 'LN';
    const timestamp = Date.now().toString().slice( -6 );
    const seed = Math.floor( Math.random() * 900 + 100 );
    const branch = await this.branchService.findById( '1' );
    const branchName = branch.name;
    const branchPrefix = branchName.slice( 0, 3 ).toUpperCase();
    const random = Math.floor( Math.random() * seed ).toString().padStart( 3, '0' );
    return `${prefix}${timestamp}${random}${branchPrefix}`;
  }

  async extendMaturityDate( id: string, extensionDays: number ): Promise<Loan> {
    const loan = await this.findById( id );

    if ( loan.status === LoanStatus.COMPLETED || loan.status === LoanStatus.DEFAULTED ) {
      throw new AppError( 400, 'Cannot extend maturity date for completed or defaulted loans' );
    }

    const newMaturityDate = addDays( loan.maturityDate, extensionDays );

    return this.update( id, { maturityDate: newMaturityDate } );
  }
}
