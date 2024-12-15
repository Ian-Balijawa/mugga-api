import { BaseService } from './base.service';
import { User } from '../entities/user.entity';
import { AppDataSource } from '../config/database.config';
import { AppError } from '../middlewares/error-handler.middleware';

export class UserService extends BaseService<User> {
    constructor() {
        super( AppDataSource.getRepository( User ) );
    }

    async findById( userId: string ): Promise<User> {
        const user = await this.repository.findOne( { where: { id: userId } } );
        if ( !user ) {
            throw new AppError( 404, 'User not found' );
        }
        return user;
    }
}
