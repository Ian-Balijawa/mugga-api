import { Request, Response } from 'express';
import { BorrowerGroupService } from '../services/borrower-group.service';
import { borrowerGroupSchema } from '../validators/borrower-group.validator';
import { LoanOfficer } from '../entities/loan-officer.entity';
import { Borrower } from '../entities/borrower.entity';

export class BorrowerGroupController {
    private borrowerGroupService = new BorrowerGroupService();

    async create( req: Request, res: Response ): Promise<void> {
        const data = await borrowerGroupSchema.parseAsync( req.body );
        const group = await this.borrowerGroupService.create( {
            ...data,
            loanOfficer: { id: req.user!.userId } as LoanOfficer,
            borrowers: data.borrowers?.map( ( borrowerId ) => ( { id: borrowerId } ) ) as Borrower[]
        } );
        res.status( 201 ).json( group );
    }

    async addBorrower( req: Request, res: Response ): Promise<void> {
        const { borrowerId } = req.body;
        const group = await this.borrowerGroupService.addBorrower( req.params.id, borrowerId );
        res.json( group );
    }

    async findAll( _req: Request, res: Response ): Promise<void> {
        const groups = await this.borrowerGroupService.findAll();
        res.json( groups );
    }

    async findById( req: Request, res: Response ): Promise<void> {
        const group = await this.borrowerGroupService.findById( req.params.id );
        res.json( group );
    }

    async update( req: Request, res: Response ): Promise<void> {
        const data = await borrowerGroupSchema.partial().parseAsync( req.body );
        const { borrowers, ...groupData } = data;
        const group = await this.borrowerGroupService.update( req.params.id, {
            ...groupData,
            borrowers: borrowers?.map( id => ( { id } ) as Borrower )
        } );
        res.json( group );
    }

    async delete( req: Request, res: Response ): Promise<void> {
        await this.borrowerGroupService.delete( req.params.id );
        res.status( 204 ).send();
    }
}
