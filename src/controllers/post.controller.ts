import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { Post } from '../entities/post.entity';
import { PostService } from '../services/post.service';
import { FileStorageService, FileCategory } from '../services/file-storage.service';
import { postSchema } from '../validators/post.validator';

export class PostController extends BaseController<Post> {
    private postService: PostService;

    constructor() {
        const postService = new PostService();
        const fileStorage = new FileStorageService();
        super( postService, fileStorage );
        this.postService = postService;
    }

    async create( req: Request, res: Response ): Promise<void> {
        const data = await postSchema.parseAsync( req.body );

        if ( req.file ) {
            const imageUrl = await this.fileStorage!.saveFile( req.file, 'posts' as FileCategory );
            data.imageUrl = imageUrl;
        }

        const post = await this.service.create( data );
        res.status( 201 ).json( {
            success: true,
            data: post
        } );
    }

    async update( req: Request, res: Response ): Promise<void> {
        const data = await postSchema.partial().parseAsync( req.body );
        const existingPost = await this.service.findById( req.params.id );

        if ( req.file ) {
            if ( existingPost.imageUrl ) {
                await this.fileStorage!.deleteFile( existingPost.imageUrl );
            }
            const imageUrl = await this.fileStorage!.saveFile( req.file, 'posts' as FileCategory );
            data.imageUrl = imageUrl;
        }

        const post = await this.service.update( req.params.id, data );
        res.json( {
            success: true,
            data: post
        } );
    }

    async delete( req: Request, res: Response ): Promise<void> {
        const post = await this.service.findById( req.params.id );
        if ( post.imageUrl ) {
            await this.fileStorage!.deleteFile( post.imageUrl );
        }
        await this.service.delete( req.params.id );
        res.status( 204 ).send();
    }

    async findByCategory( req: Request, res: Response ): Promise<void> {
        const posts = await this.postService.findByCategory( req.params.category as Post['category'] );
        res.json( {
            success: true,
            data: posts
        } );
    }

    async search( req: Request, res: Response ): Promise<void> {
        const query = req.query.q as string;
        const posts = await this.postService.search( query );
        res.json( {
            success: true,
            data: posts
        } );
    }
}
