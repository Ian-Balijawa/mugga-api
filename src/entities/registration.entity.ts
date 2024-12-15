import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Program } from './program.entity';

@Entity('registrations')
export class Registration extends BaseEntity {
    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column('date')
    dateOfBirth: Date;

    @ManyToOne(() => Program)
    program: Program;

    @Column('date')
    startDate: Date;

    @Column()
    emergencyName: string;

    @Column()
    emergencyPhone: string;

    @Column()
    emergencyRelation: string;

    @Column('text', { nullable: true })
    medicalConditions?: string;

    @Column('text', { nullable: true })
    allergies?: string;

    @Column('text', { nullable: true })
    medications?: string;
}
