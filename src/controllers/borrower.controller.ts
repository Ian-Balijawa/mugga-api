import { Request, Response } from 'express';
import { BorrowerService } from '../services/borrower.service';
import { borrowerSchema } from '../validators/borrower.validator';
import { LoanOfficer } from '../entities/loan-officer.entity';
import { Guarantor } from '../entities/guarantor.entity';

export class BorrowerController {
  private borrowerService = new BorrowerService();

  async create( req: Request, res: Response ): Promise<void> {
    const data = await borrowerSchema.parseAsync( req.body );
    const borrower = await this.borrowerService.create( {
      ...data,
      dateOfBirth: new Date( data.dateOfBirth ),
      loanOfficer: { id: req.user!.userId } as LoanOfficer,
      guarantors: data.guarantors.map( ( guarantor ) => ( {
        ...guarantor,
        borrower: borrower
      } ) ) as Guarantor[]

    } );
    res.status( 201 ).json( borrower );
  }

  async findAll( _req: Request, res: Response ): Promise<void> {
    const borrowers = await this.borrowerService.findAll();
    res.json( borrowers );
  }

  async findById( req: Request, res: Response ): Promise<void> {
    const borrower = await this.borrowerService.findById( req.params.id );
    res.json( borrower );
  }

  async update( req: Request, res: Response ): Promise<void> {
    const data = await borrowerSchema.partial().parseAsync( req.body );
    const borrower = await this.borrowerService.update( req.params.id, data );
    res.json( borrower );
  }

  async delete( req: Request, res: Response ): Promise<void> {
    await this.borrowerService.delete( req.params.id );
    res.status( 204 ).send();
  }

  async findByLoanOfficer( req: Request, res: Response ): Promise<void> {
    const borrowers = await this.borrowerService.findByLoanOfficer( req.user!.userId );
    res.json( borrowers );
  }
}
