import { AppDataSource } from '../config/database.config';
import { User } from '../entities/user.entity';
import { AppError } from '../middlewares/error-handler.middleware';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import env from '../config/env.config';
import { SignupInput } from '../validators/auth.validator';
import { hashPassword, comparePasswords } from '../utils/password.utils';
export class AuthService {
    private userRepository = AppDataSource.getRepository( User );

    async login( email: string, password: string ): Promise<{ token: string, user: User }> {
        const user = await this.userRepository.findOne( { where: { email } } );
        if ( !user || !await comparePasswords( password, user.password ) ) {
            throw new AppError( 401, 'Invalid credentials' );
        }
        const token = this.generateToken( user );
        return { token, user }
    }

    async logout( _userId: number ): Promise<void> {
        // Implement token invalidation if needed
    }

    async findById( userId: number ): Promise<User> {
        const user = await this.userRepository.findOne( { where: { id: userId } } );
        if ( !user ) {
            throw new AppError( 404, 'User not found' );
        }
        return user;
    }

    private generateToken( user: User ): string {
        const options: SignOptions = { expiresIn: +env.JWT_EXPIRES_IN };
        const secret: Secret = env.JWT_SECRET;
        return jwt.sign(
            { userId: user.id, roles: user.roles },
            secret,
            options
        );
    }

    async verifyToken( token: string ): Promise<User> {
        try {
            const decoded = jwt.verify( token, env.JWT_SECRET ) as { userId: number };
            const user = await this.userRepository.findOne( { where: { id: decoded.userId } } );

            if ( !user ) {
                throw new AppError( 401, 'Invalid token' );
            }

            return user;
        } catch ( error ) {
            throw new AppError( 401, 'Invalid token' );
        }
    }

    async createAdmin( data: SignupInput ): Promise<User> {
        const existingUser = await this.userRepository.findOne( {
            where: { email: data.email }
        } );

        if ( existingUser ) {
            throw new AppError( 400, 'Email already in use' );
        }

        const hashedPassword = await hashPassword( data.password );

        const user = this.userRepository.create( {
            email: data.email,
            password: hashedPassword,
            roles: ['admin']
        } );

        return this.userRepository.save( user );
    }

    async delete( userId: number ): Promise<void> {
        await this.userRepository.delete( userId );
    }

    async update( userId: number, data: Partial<User> ): Promise<User> {
        const user = await this.userRepository.findOne( { where: { id: userId } } );
        if ( !user ) {
            throw new AppError( 404, 'User not found' );
        }
        return this.userRepository.save( { ...user, ...data } );
    }
}
