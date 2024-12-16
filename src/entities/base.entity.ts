import { BaseEntity as TypeOrmBaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, VersionColumn, Column } from 'typeorm';

export abstract class BaseEntity extends TypeOrmBaseEntity {
    @PrimaryGeneratedColumn( 'increment' )
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date | null;

    @Column( { type: 'int', nullable: true } )
    createdBy?: number;

    @Column( { type: 'int', nullable: true } )
    updatedBy?: number;

    @Column( { type: 'int', nullable: true } )
    deletedBy?: number;

    @VersionColumn()
    version: number;

    @Column( { default: false } )
    isDeleted: boolean;
}
