import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { Registration } from '../entities/registration.entity';
import { RegistrationService } from '../services/registration.service';
import { RegistrationInput, registrationSchema } from '../validators/registration.validator';
import { MailService } from '../services/mail.service';
import { ProgramService } from '../services/program.service';

export class RegistrationController extends BaseController<Registration> {
    private registrationService: RegistrationService;
    private mailService: MailService;
    private programService: ProgramService;

    constructor() {
        const registrationService = new RegistrationService();
        super( registrationService );
        this.registrationService = registrationService;
        this.mailService = new MailService();
        this.programService = new ProgramService();
    }

    async create( req: Request, res: Response ): Promise<void> {
        const data = await registrationSchema.parseAsync( req.body as RegistrationInput );

        console.log( `Data: ${data.programId}` );
        const registration = await this.service.create( { ...data, program: { id: data.programId } } );
        const program = await this.programService.findById( data.programId );

        await this.mailService.sendRegistrationConfirmation( data.firstName, data.email, program.name );

        console.error( `Registration: ${registration}` );

        res.status( 201 ).json( {
            success: true,
            data: registration
        } );
    }

    async findByProgram( req: Request, res: Response ): Promise<void> {
        const registrations = await this.registrationService.findByProgram( +req.params.programId );
        res.json( {
            success: true,
            data: registrations
        } );
    }

    async checkAvailability( req: Request, res: Response ): Promise<void> {
        const { programId } = req.params;
        const isAvailable = await this.registrationService.checkProgramAvailability( +programId );
        res.json( {
            success: true,
            data: { isAvailable }
        } );
    }
}
