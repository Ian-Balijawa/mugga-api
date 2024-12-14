import { BaseService } from './base.service';
import { BorrowerGroup } from '../entities/borrower-group.entity';
import { AppDataSource } from '../config/database.config';
import { AppError } from '../middlewares/error-handler.middleware';
import { Borrower } from '../entities/borrower.entity';

export class BorrowerGroupService extends BaseService<BorrowerGroup> {
    constructor() {
        super( AppDataSource.getRepository( BorrowerGroup ) );
    }

    async create( data: Partial<BorrowerGroup> ): Promise<BorrowerGroup> {
        const group = await super.create( {
            ...data,
            groupNumber: await this.generateGroupNumber(),
            memberCount: 0
        } );
        return group;
    }

    async addBorrower( groupId: string, borrowerId: string ): Promise<BorrowerGroup> {
        const group = await this.findById( groupId );
        if ( group.memberCount >= 200 ) {
            throw new AppError( 400, 'Group has reached maximum capacity of 200 members' );
        }

        const borrowerRepo = AppDataSource.getRepository( Borrower );
        const borrower = await borrowerRepo.findOne( { where: { id: borrowerId } } );
        if ( !borrower ) {
            throw new AppError( 404, 'Borrower not found' );
        }

        borrower.borrowerGroup = group;
        await borrowerRepo.save( borrower );

        group.memberCount += 1;
        return this.repository.save( group );
    }

    private async generateGroupNumber(): Promise<string> {
        const prefix = 'BG';
        const timestamp = Date.now().toString().slice( -6 );
        const random = Math.floor( Math.random() * 1000 ).toString().padStart( 3, '0' );
        return `${prefix}${timestamp}${random}`;
    }
}
