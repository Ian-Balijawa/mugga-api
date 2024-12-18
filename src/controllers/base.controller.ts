import { Request, Response } from 'express';
import { BaseService } from '../services/base.service';
import { BaseEntity } from '../entities/base.entity';

export abstract class BaseController<T extends BaseEntity> {
    constructor(
        protected service: BaseService<T>
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
        const entity = await this.service.findById( +req.params.id );
        res.json( {
            success: true,
            data: entity
        } );
    }

    async update( req: Request, res: Response ): Promise<void> {
        const entity = await this.service.update( +req.params.id, req.body );
        res.json( {
            success: true,
            data: entity
        } );
    }

    async delete( req: Request, res: Response ): Promise<void> {
        const userId = ( req as any ).user?.id; // Get user from auth middleware
        await this.service.delete( +req.params.id, userId );
        res.status( 204 ).send();
    }

    // Optional: Add restore endpoint
    async restore( req: Request, res: Response ): Promise<void> {
        const entity = await this.service.restore( +req.params.id );
        res.json( {
            success: true,
            data: entity
        } );
    }

    async patch( req: Request, res: Response ): Promise<void> {
        const entity = await this.service.update( +req.params.id, req.body );
        res.json( {
            success: true,
            data: entity
        } );
    }
}
