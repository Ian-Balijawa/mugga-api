import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Registration } from './registration.entity';

export type ProgramCategory = 'activity' | 'services' | 'destination';

@Entity( 'programs' )
export class Program extends BaseEntity {
    @Column()
    name: string;

    @Column( 'text' )
    description: string;

    @Column()
    duration: string;

    @Column( 'decimal', { precision: 10, scale: 2 } )
    price: number;

    @Column()
    schedule: string;

    @Column( {
        type: 'enum',
        enum: ['destination', 'activity', 'services']
    } )
    category: ProgramCategory;

    @Column()
    imageUrl: string;

    @Column( { default: true } )
    isActive: boolean;

    @Column( { default: 20 } )
    maxParticipants: number;

    @OneToMany( () => Registration, (registration) => registration.program )
    registrations: Registration[];
}
