import { Request, Response } from 'express';
import { loanOfficerSchema } from '../validators/loan-officer.validator';
import { LoanOfficerService } from '../services/loan-officer.service';

export class LoanOfficerController {
  private loanOfficerService = new LoanOfficerService();

  async create( req: Request, res: Response ): Promise<void> {
    const data = await loanOfficerSchema.parseAsync( req.body );
    const loanOfficer = await this.loanOfficerService.create( data );
    res.status( 201 ).json( loanOfficer );
  }

  async findAll( _req: Request, res: Response ): Promise<void> {
    const loanOfficers = await this.loanOfficerService.findAll();
    res.json( loanOfficers );
  }

  async findById( req: Request, res: Response ): Promise<void> {
    const loanOfficer = await this.loanOfficerService.findById( req.params.id );
    res.json( loanOfficer );
  }

  async update( req: Request, res: Response ): Promise<void> {
    const data = await loanOfficerSchema.partial().parseAsync( req.body );
    const loanOfficer = await this.loanOfficerService.update( req.params.id, data );
    res.json( loanOfficer );
  }

  async delete( req: Request, res: Response ): Promise<void> {
    await this.loanOfficerService.delete( req.params.id );
    res.status( 204 ).send();
  }

  async findWithBorrowers( req: Request, res: Response ): Promise<void> {
    const loanOfficer = await this.loanOfficerService.findWithBorrowers( req.params.id );
    res.json( loanOfficer );
  }
}
