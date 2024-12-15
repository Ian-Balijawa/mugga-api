import { Request, Response } from 'express';
import { BaseService } from '../services/base.service';
import { FileStorageService } from '../services/file-storage.service';
import { ObjectLiteral } from 'typeorm';

export abstract class BaseController<T extends ObjectLiteral> {
    constructor(
        protected service: BaseService<T>,
        protected fileStorage?: FileStorageService
    ) { }

    async create( req: Request, res: Response ): Promise<void> {
        const entity = await this.service.create( req.body );
        res.status( 201 ).json( {
            success: true,
            data: entity
        } );
    }

    async findAll( _req: Request, res: Response ): Promise<void> {
        const entities = await this.service.findAll();
        res.json( {
            success: true,
            data: entities
        } );
    }

    async findById( req: Request, res: Response ): Promise<void> {
        const entity = await this.service.findById( req.params.id );
        res.json( {
            success: true,
            data: entity
        } );
    }

    async update( req: Request, res: Response ): Promise<void> {
        const entity = await this.service.update( req.params.id, req.body );
        res.json( {
            success: true,
            data: entity
        } );
    }

    async delete( req: Request, res: Response ): Promise<void> {
        await this.service.delete( req.params.id );
        res.status( 204 ).send();
    }
}
