import { Request, Response } from 'express';
import { FeeService } from '../services/fee.service';
import { feeSchema } from '../validators/fee.validator';

export class FeeController {
  private feeService = new FeeService();

  async create( req: Request, res: Response ): Promise<void> {
    const data = await feeSchema.parseAsync( req.body );
    const fee = await this.feeService.create( data );
    res.status( 201 ).json( fee );
  }

  async findAll( _req: Request, res: Response ): Promise<void> {
    const fees = await this.feeService.findAll();
    res.json( fees );
  }

  async findById( req: Request, res: Response ): Promise<void> {
    const fee = await this.feeService.findById( req.params.id );
    res.json( fee );
  }

  async delete( req: Request, res: Response ): Promise<void> {
    await this.feeService.delete( req.params.id );
    res.status( 204 ).send();
  }
}
