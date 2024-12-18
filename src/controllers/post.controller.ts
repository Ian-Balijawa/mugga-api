import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { Post } from '../entities/post.entity';
import { PostService } from '../services/post.service';
import { postSchema } from '../validators/post.validator';

export class PostController extends BaseController<Post> {
    constructor() {
        const postService = new PostService();
        super( postService );
    }

    async create( req: Request, res: Response ): Promise<void> {
        const data = await postSchema.parseAsync( req.body );
        const post = await this.service.create( data );
        res.status( 201 ).json( {
            success: true,
            data: post
        } );
    }

    async update( req: Request, res: Response ): Promise<void> {
        const data = await postSchema.partial().parseAsync( req.body );
        const post = await this.service.update( +req.params.id, data );
        res.json( {
            success: true,
            data: post
        } );
    }
}
