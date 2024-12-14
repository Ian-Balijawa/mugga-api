import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';
import { paymentSchema } from '../validators/payment.validator';

export class PaymentController {
    private paymentService = new PaymentService();

    async create( req: Request, res: Response ): Promise<void> {
        const data = await paymentSchema.parseAsync( req.body );
        const payment = await this.paymentService.create( data );
        res.status( 201 ).json( payment );
    }

    async findByLoan( req: Request, res: Response ): Promise<void> {
        const payments = await this.paymentService.findByLoan( req.params.loanId );
        res.json( payments );
    }

    async update( req: Request, res: Response ): Promise<void> {
        const data = await paymentSchema.partial().parseAsync( req.body );
        const payment = await this.paymentService.update( req.params.id, data );
        res.json( payment );
    }

    async delete( req: Request, res: Response ): Promise<void> {
        await this.paymentService.delete( req.params.id );
        res.status( 204 ).send();
    }
}
