import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity( 'alumni' )
export class Alumni extends BaseEntity {
    @Column()
    name: string;

    @Column()
    graduationYear: number;

    @Column( { nullable: true } )
    currentTeam?: string;

    @Column( 'simple-array' )
    achievements: string[];

    @Column()
    image: string;

    @Column()
    position: string;

    @Column( {
        type: 'enum',
        enum: ['professional', 'college', 'youth']
    } )
    category: 'professional' | 'college' | 'youth';
}
