import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity( 'coaches' )
export class Coach extends BaseEntity {
    @Column()
    name: string;

    @Column()
    role: string;

    @Column( 'text' )
    bio: string;

    @Column()
    imageUrl: string;

    @Column( 'simple-array' )
    specialties: string[];
}
