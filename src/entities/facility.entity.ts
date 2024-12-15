import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('facilities')
export class Facility extends BaseEntity {
    @Column()
    name: string;

    @Column('text')
    description: string;

    @Column('simple-array')
    features: string[];

    @Column()
    imageUrl: string;

    @Column('simple-array')
    equipment: string[];
}
