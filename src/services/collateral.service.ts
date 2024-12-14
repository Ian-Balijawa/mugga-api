import { BaseService } from './base.service';
import { Collateral } from '../entities/collateral.entity';
import { AppDataSource } from '../config/database.config';
import { LoanService } from './loan.service';

export class CollateralService extends BaseService<Collateral> {
    private loanService: LoanService;

    constructor() {
        super( AppDataSource.getRepository( Collateral ) );
        this.loanService = new LoanService();
    }

    async create( data: Omit<Partial<Collateral>, 'loan'> & { loan: { id: string } } ): Promise<Collateral> {
        const { loan: { id }, ...collateralData } = data;
        const loan = await this.loanService.findById( id );
        return super.create( { ...collateralData, loan } as Partial<Collateral> );
    }

    async findByLoan( loanId: string ): Promise<Collateral[]> {
        return this.repository.find( {
            where: { loan: { id: loanId } },
            order: { createdAt: 'DESC' }
        } );
    }
}
