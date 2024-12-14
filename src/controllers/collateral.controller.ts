import { Request, Response } from 'express';
import { CollateralService } from '../services/collateral.service';
import { collateralSchema } from '../validators/collateral.validator';

export class CollateralController {
    private collateralService = new CollateralService();

    async create( req: Request, res: Response ): Promise<void> {
        const data = await collateralSchema.parseAsync( req.body );
        const collateral = await this.collateralService.create( data );
        res.status( 201 ).json( collateral );
    }

    async findByLoan( req: Request, res: Response ): Promise<void> {
        const collaterals = await this.collateralService.findByLoan( req.params.loanId );
        res.json( collaterals );
    }

    async update( req: Request, res: Response ): Promise<void> {
        const data = await collateralSchema.partial().parseAsync( req.body );
        const collateral = await this.collateralService.update( req.params.id, data );
        res.json( collateral );
    }

    async delete( req: Request, res: Response ): Promise<void> {
        await this.collateralService.delete( req.params.id );
        res.status( 204 ).send();
    }
}
