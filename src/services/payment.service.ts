import { BaseService } from './base.service';
import { Payment } from '../entities/payment.entity';
import { AppDataSource } from '../config/database.config';
import { LoanService } from './loan.service';
import { AppError } from '../middlewares/error-handler.middleware';
import { PaymentStatus } from '../entities/payment.entity';

export class PaymentService extends BaseService<Payment> {
    private loanService: LoanService;

    constructor() {
        super( AppDataSource.getRepository( Payment ) );
        this.loanService = new LoanService();
    }

    async create( data: Omit<Partial<Payment>, 'loan'> & { loan: { id: string } } ): Promise<Payment> {
        const { loan: { id }, ...paymentData } = data;
        const loan = await this.loanService.findById( id );

        if ( loan.totalPaid + paymentData.amount! > loan.totalAmount ) {
            throw new AppError( 400, 'Payment amount exceeds remaining loan balance' );
        }

        const payment = await super.create( {
            ...paymentData,
            status: PaymentStatus.COMPLETED,
            loan
        } as Partial<Payment> );

        await this.loanService.update( id, {
            totalPaid: loan.totalPaid + paymentData.amount!
        } );

        return payment;
    }

    async findByLoan( loanId: string ): Promise<Payment[]> {
        return this.repository.find( {
            where: { loan: { id: loanId } },
            order: { createdAt: 'DESC' }
        } );
    }
}
