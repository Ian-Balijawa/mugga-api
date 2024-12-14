import { BaseService } from './base.service';
import { Borrower } from '../entities/borrower.entity';
import { AppDataSource } from '../config/database.config';
import { Guarantor } from '../entities/guarantor.entity';

export class BorrowerService extends BaseService<Borrower> {
  constructor() {
    super( AppDataSource.getRepository( Borrower ) );
  }

  async create( data: Partial<Borrower> ): Promise<Borrower> {
    const { guarantors: guarantorData, ...borrowerData } = data;

    const borrower = await super.create( {
      ...borrowerData,
      uniqueNumber: await this.generateUniqueNumber()
    } );

    if ( guarantorData ) {
      const guarantorRepo = AppDataSource.getRepository( Guarantor );
      const guarantors = guarantorData.map( g => guarantorRepo.create( { ...g, borrower } ) );
      borrower.guarantors = await guarantorRepo.save( guarantors );
    }

    return borrower;
  }

  async findByLoanOfficer( loanOfficerId: string ): Promise<Borrower[]> {
    return this.repository.find( {
      where: { loanOfficer: { id: loanOfficerId } },
      relations: ['loans', 'user']
    } );
  }

  private async generateUniqueNumber(): Promise<string> {
    const prefix = 'BR';
    const timestamp = Date.now().toString().slice( -6 );
    const random = Math.floor( Math.random() * 1000 ).toString().padStart( 3, '0' );
    return `${prefix}${timestamp}${random}`;
  }
}
