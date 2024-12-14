import jwt from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { AppError } from '../middlewares/error-handler.middleware';
import env from '../config/env.config';
import redis from '../config/redis.config';
import { UserContext } from '../types/common.types';
import { VerificationService } from './verification.service';
import { UserService } from './user.service';
import { hashPassword } from '../utils/auth.utils';
import { AppDataSource } from '../config/database.config';
import { LoanOfficer } from '../entities/loan-officer.entity';
import { User } from '../entities/user.entity';

export class AuthService {
  private readonly TOKEN_PREFIX = 'token:';
  private verificationService: VerificationService;
  private userService: UserService;

  constructor() {
    this.verificationService = new VerificationService( redis );
    this.userService = new UserService();
  }

  public async hashPassword( password: string ): Promise<string> {
    return hashPassword( password );
  }

  public async comparePasswords( password: string, hashedPassword: string ): Promise<boolean> {
    return compare( password, hashedPassword );
  }

  public async generateToken( userId: string, roles: string[] ): Promise<string> {
    const token = jwt.sign(
      { userId, roles },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    await redis.setex(
      `${this.TOKEN_PREFIX}${userId}`,
      3600,
      token
    );

    return token;
  }

  public async validateToken( token: string ): Promise<UserContext> {
    try {
      const decoded = jwt.verify( token, env.JWT_SECRET ) as UserContext;
      const cachedToken = await redis.get( `${this.TOKEN_PREFIX}${decoded.userId}` );

      if ( !cachedToken || cachedToken !== token ) {
        throw new AppError( 401, 'Invalid token' );
      }

      return decoded;
    } catch ( error ) {
      throw new AppError( 401, 'Invalid token' );
    }
  }

  public async invalidateToken( userId: string ): Promise<void> {
    await redis.del( `${this.TOKEN_PREFIX}${userId}` );
  }

  async initiatePasswordReset( email: string ): Promise<string> {
    const user = await this.userService.findByEmail( email );
    if ( !user ) {
      throw new AppError( 404, 'User not found' );
    }

    const securityCode = await this.verificationService.generateSecurityCodeForReset( email );
    return securityCode;
  }

  async changePassword( userId: string, currentPassword: string, newPassword: string ): Promise<void> {
    const user = await this.userService.findById( userId );

    const isValid = await this.comparePasswords( currentPassword, user.password );
    if ( !isValid ) {
      throw new AppError( 400, 'Current password is incorrect' );
    }

    const hashedPassword = await this.hashPassword( newPassword );
    await this.userService.update( userId, { password: hashedPassword } );
    await this.invalidateToken( userId );
  }

  async verifyEmail( email: string, otp: string ): Promise<void> {
    const user = await this.userService.findByEmail( email );
    if ( !user ) {
      throw new AppError( 404, 'User not found' );
    }

    const isValid = await this.verificationService.verifyEmailOTP( email, otp );
    if ( !isValid ) {
      throw new AppError( 400, 'Invalid or expired OTP' );
    }

    await this.userService.update( user.id, { emailVerified: true } );
  }

  async verifyPhone( userId: string, phone: string, otp: string ): Promise<void> {
    const isValid = await this.verificationService.verifyPhoneOTP( phone, otp );
    if ( !isValid ) {
      throw new AppError( 400, 'Invalid or expired OTP' );
    }

    await this.userService.update( userId, { phoneVerified: true } );
  }

  async verifySecurityCode( email: string, code: string ): Promise<void> {
    const isValid = await this.verificationService.verifySecurityCode( email, code );
    if ( !isValid ) {
      throw new AppError( 400, 'Invalid or expired security code' );
    }
  }

  async resetPassword( email: string, newPassword: string, otp: string ): Promise<void> {
    const user = await this.userService.findByEmail( email );
    if ( !user ) {
      throw new AppError( 404, 'User not found' );
    }

    const isValid = await this.verificationService.verifySecurityCode( email, otp );
    if ( !isValid ) {
      throw new AppError( 400, 'Invalid or expired OTP' );
    }

    const hashedPassword = await this.hashPassword( newPassword );
    await this.userService.update( user.id, { password: hashedPassword } );
  }

  async createLoanOfficer( data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    employeeId: string;
    isAdmin: boolean;
    isActive: boolean;
  } ): Promise<LoanOfficer> {
    const user = await this.userService.create( {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      roles: data.isAdmin ? ['admin', 'loan_officer'] : ['loan_officer']
    } );

    return AppDataSource.getRepository( LoanOfficer ).save( {
      user,
      employeeId: data.employeeId,
      isAdmin: data.isAdmin,
      isActive: data.isActive
    } );
  }

  async signin( email: string, password: string ): Promise<{ token: string; user: User }> {
    const user = await this.userService.findByEmail( email );
    if ( !user ) {
      throw new AppError( 401, 'Invalid credentials' );
    }

    const isValid = await this.comparePasswords( password, user.password );
    if ( !isValid ) {
      throw new AppError( 401, 'Invalid credentials' );
    }

    const token = await this.generateToken( user.id, user.roles );
    return { token, user };
  }

  async toggleLoanOfficerActivation( loanOfficerId: string, isActive: boolean ): Promise<void> {
    const loanOfficer = await AppDataSource.getRepository( LoanOfficer ).findOne( {
      where: { id: loanOfficerId },
      relations: ['user']
    } );

    if ( !loanOfficer ) {
      throw new AppError( 404, 'Loan officer not found' );
    }

    if ( loanOfficer.isAdmin ) {
      throw new AppError( 400, 'Cannot toggle activation for admin accounts' );
    }

    await AppDataSource.getRepository( LoanOfficer ).update( loanOfficerId, { isActive } );
  }
}
