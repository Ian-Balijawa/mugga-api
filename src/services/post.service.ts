import { BaseService } from './base.service';
import { Post } from '../entities/post.entity';
import { AppDataSource } from '../config/database.config';

export class PostService extends BaseService<Post> {
    constructor() {
        super( AppDataSource.getRepository( Post ) );
    }

    async findByCategory( category: Post['category'] ): Promise<Post[]> {
        return this.repository.find( {
            where: { category },
            order: { createdAt: 'DESC' }
        } );
    }

    async search( query: string ): Promise<Post[]> {
        return this.repository
            .createQueryBuilder( 'post' )
            .where( 'post.title LIKE :query OR post.content LIKE :query', {
                query: `%${query}%`
            } )
            .orderBy( 'post.createdAt', 'DESC' )
            .getMany();
    }
}
