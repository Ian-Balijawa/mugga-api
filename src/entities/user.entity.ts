import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { IsEmail, MinLength } from 'class-validator';

@Entity( 'users' )
export class User extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Index()
  @Column( { unique: true } )
  phone: string;

  @Index()
  @Column( { unique: true } )
  @IsEmail()
  email: string;

  @Column()
  @MinLength( 8 )
  @Column( { select: false } )
  password: string;

  @Column( 'json' )
  roles: string[] = ['user'];

  @Column( { default: false } )
  emailVerified: boolean;

  @Column( { default: false } )
  phoneVerified: boolean;
}
