import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { loginSchema, signupSchema } from '../validators/auth.validator';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async login( req: Request, res: Response ): Promise<void> {
        const { email, password } = await loginSchema.parseAsync( req.body );
        const token = await this.authService.login( email, password );
        res.json( { success: true, data: { token } } );
    }

    async logout( req: Request, res: Response ): Promise<void> {
        await this.authService.logout( req.user!.userId );
        res.status( 204 ).send();
    }

    async getCurrentUser( req: Request, res: Response ): Promise<void> {
        const user = await this.authService.findById( req.user!.userId );
        res.json( { success: true, data: user } );
    }

    async signup( req: Request, res: Response ): Promise<void> {
        const data = await signupSchema.parseAsync( req.body );
        const user = await this.authService.createAdmin( data );
        res.status( 201 ).json( {
            success: true,
            data: user
        } );
    }
}
