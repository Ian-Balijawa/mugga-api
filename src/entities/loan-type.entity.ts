import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { LoanType as LoanTypeEnum } from './loan.entity';

@Entity( 'loan_types' )
export class LoanType extends BaseEntity {
    @Column( {
        type: 'enum',
        enum: LoanTypeEnum,
        enumName: 'loan_type_enum',
        unique: true,
    } )
    type: LoanTypeEnum;

    @Column( { type: 'text', nullable: true } )
    description?: string;
}
