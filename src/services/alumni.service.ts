import { BaseService } from './base.service';
import { Alumni } from '../entities/alumni.entity';
import { AppDataSource } from '../config/database.config';

export class AlumniService extends BaseService<Alumni> {
    constructor() {
        super( AppDataSource.getRepository( Alumni ) );
    }
}
