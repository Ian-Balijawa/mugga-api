import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { Registration } from '../entities/registration.entity';
import { RegistrationService } from '../services/registration.service';
import { registrationSchema } from '../validators/registration.validator';
import { MailService } from '../services/mail.service';

export class RegistrationController extends BaseController<Registration> {
    private registrationService: RegistrationService;
    private mailService: MailService;

    constructor() {
        const registrationService = new RegistrationService();
        super( registrationService );
        this.registrationService = registrationService;
        this.mailService = new MailService();
    }

    async create( req: Request, res: Response ): Promise<void> {
        const data = await registrationSchema.parseAsync( req.body );
        const registration = await this.service.create( data );

        // Send confirmation email
        await this.mailService.sendRegistrationConfirmation( registration );

        res.status( 201 ).json( {
            success: true,
            data: registration
        } );
    }

    async findByProgram( req: Request, res: Response ): Promise<void> {
        const registrations = await this.registrationService.findByProgram( req.params.programId );
        res.json( {
            success: true,
            data: registrations
        } );
    }

    async checkAvailability( req: Request, res: Response ): Promise<void> {
        const { programId } = req.params;
        const isAvailable = await this.registrationService.checkProgramAvailability( programId );
        res.json( {
            success: true,
            data: { isAvailable }
        } );
    }
}
