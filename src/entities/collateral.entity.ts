import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Loan } from './loan.entity';

export enum CollateralType {
    REAL_ESTATE = 'real_estate',
    VEHICLE = 'vehicle',
    MACHINERY = 'machinery',
    INVENTORY = 'inventory',
    FINANCIAL_INSTRUMENT = 'financial_instrument',
    PERSONAL_PROPERTY = 'personal_property',
    OTHER = 'other'
}

@Entity( 'collaterals' )
export class Collateral extends BaseEntity {
    @PrimaryGeneratedColumn( 'increment' )
    id: number;

    @Column()
    name: string;

    @Column( {
        type: 'enum',
        enum: CollateralType
    } )
    type: CollateralType;

    @Column( 'decimal', { precision: 10, scale: 2 } )
    value: number;

    @Column( { type: 'text' } )
    description: string;

    @Column( 'simple-array', { nullable: true } )
    documents?: string[];

    @ManyToOne( () => Loan, loan => loan.collaterals, { onDelete: 'CASCADE' } )
    loan: Loan;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
