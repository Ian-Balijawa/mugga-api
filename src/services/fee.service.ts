import { BaseService } from './base.service';
import { Fee, FeeCalculationType } from '../entities/fee.entity';
import { AppDataSource } from '../config/database.config';
import { LoanService } from './loan.service';

export class FeeService extends BaseService<Fee> {
  private loanService: LoanService;

  constructor() {
    super( AppDataSource.getRepository( Fee ) );
    this.loanService = new LoanService();
  }

  async create( data: Omit<Partial<Fee>, 'loan'> & { loan: { id: string } } ): Promise<Fee> {
    const { loan: { id }, ...feeData } = data;
    const loan = await this.loanService.findById( id );
    return super.create( { ...feeData, loan } as Partial<Fee> );
  }

  async delete( id: string ): Promise<void> {
    const fee = await this.findById( id );
    const loan = await this.loanService.findById( fee.loan.id );

    const amount = fee.calculationType === FeeCalculationType.PERCENTAGE ?
      ( loan.principalAmount * fee.value / 100 ) :
      fee.amount;

    await super.delete( id );

    await this.loanService.update( loan.id, {
      totalFees: loan.totalFees - amount
    } );
  }
}
