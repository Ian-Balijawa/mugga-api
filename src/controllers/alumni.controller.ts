import { BaseController } from './base.controller';
import { Alumni } from '../entities/alumni.entity';
import { AlumniService } from '../services/alumni.service';

export class AlumniController extends BaseController<Alumni> {
    protected service: AlumniService;

    constructor() {
        const service = new AlumniService();
        super( service );
        this.service = service;
    }
}
