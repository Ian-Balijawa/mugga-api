import { BaseEntity as TypeOrmBaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, VersionColumn, Column } from 'typeorm';

export abstract class BaseEntity extends TypeOrmBaseEntity {
    @PrimaryGeneratedColumn( 'uuid' )
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date | null;

    @Column( { nullable: true } )
    createdBy?: string;

    @Column( { nullable: true } )
    updatedBy?: string;

    @Column( { nullable: true } )
    deletedBy?: string;

    @VersionColumn()
    version: number;

    @Column( { default: false } )
    isDeleted: boolean;
}
