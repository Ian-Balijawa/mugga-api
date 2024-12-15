import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

export type PostCategory = 'news' | 'events' | 'updates';

@Entity('posts')
export class Post extends BaseEntity {
    @Column()
    title: string;

    @Column('text')
    content: string;

    @Column({ nullable: true })
    imageUrl?: string;

    @Column({ nullable: true })
    videoUrl?: string;

    @Column({
        type: 'enum',
        enum: ['news', 'events', 'updates']
    })
    category: PostCategory;
}
