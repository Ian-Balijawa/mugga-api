import { Request, Response } from 'express';
import { LoanService } from '../services/loan.service';
import { loanSchema } from '../validators/loan.validator';
import { LoanStatus } from '../entities/loan.entity';

export class LoanController {
  private loanService = new LoanService();

  async create( req: Request, res: Response ): Promise<void> {
    const data = await loanSchema.parseAsync( req.body );
    const loan = await this.loanService.create( {
      ...data,
      releaseDate: new Date( data.releaseDate ),
      maturityDate: new Date( data.maturityDate ),
      status: LoanStatus.PENDING,
      createdBy: req.user!.userId,
      totalFees: 0,
      branch: { id: data.branchId },
      loanOfficer: { id: data.loanOfficerId },
      borrower: { id: data.borrowerId }
    } );
    res.status( 201 ).json( loan );
  }

  async findAll( _req: Request, res: Response ): Promise<void> {
    const loans = await this.loanService.findAll();
    res.json( loans );
  }

  async findById( req: Request, res: Response ): Promise<void> {
    const loan = await this.loanService.findById( req.params.id );
    res.json( loan );
  }

  async updateStatus( req: Request, res: Response ): Promise<void> {
    const { status } = req.body;
    const loan = await this.loanService.updateStatus( req.params.id, status );
    res.json( loan );
  }

  async extendMaturity( req: Request, res: Response ): Promise<void> {
    const { extensionDays } = req.body;
    const loan = await this.loanService.extendMaturityDate( req.params.id, extensionDays );
    res.json( loan );
  }

  async update( req: Request, res: Response ): Promise<void> {
    const data = await loanSchema.parseAsync( req.body );
    const loan = await this.loanService.update( req.params.id, data );
    res.json( loan );
  }

  async delete( req: Request, res: Response ): Promise<void> {
    await this.loanService.delete( req.params.id );
    res.status( 204 ).send();
  }
}
