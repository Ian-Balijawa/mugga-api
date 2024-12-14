import { Request, Response } from 'express';
import { BranchService } from '../services/branch.service';
import { createBranchSchema, updateBranchSchema } from '../validators/branch.validator';

export class BranchController {
    private branchService = new BranchService();

    async create( req: Request, res: Response ): Promise<void> {
        const data = await createBranchSchema.parseAsync( req.body );
        const branch = await this.branchService.create( data );
        res.status( 201 ).json( branch );
    }

    async findAll( _req: Request, res: Response ): Promise<void> {
        const branches = await this.branchService.findAll();
        res.json( branches );
    }

    async findById( req: Request, res: Response ): Promise<void> {
        const branch = await this.branchService.findById( req.params.id );
        res.json( branch );
    }

    async update( req: Request, res: Response ): Promise<void> {
        const data = await updateBranchSchema.parseAsync( req.body );
        const branch = await this.branchService.update( req.params.id, data );
        res.json( branch );
    }

    async delete( req: Request, res: Response ): Promise<void> {
        await this.branchService.delete( req.params.id );
        res.status( 204 ).send();
    }

    async addLoanOfficer( req: Request, res: Response ): Promise<void> {
        const { loanOfficerId } = req.body;
        const branch = await this.branchService.addLoanOfficer( req.params.id, loanOfficerId );
        res.json( branch );
    }
}
