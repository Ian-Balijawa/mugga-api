import { Request, Response } from 'express';
import { MailService } from '../services/mail.service';
import { contactFormSchema } from '../validators/contact.validator';

export class ContactController {
    private mailService: MailService;

    constructor() {
        this.mailService = new MailService();
    }

    async submitForm( req: Request, res: Response ): Promise<void> {
        const data = await contactFormSchema.parseAsync( req.body );
        await this.mailService.sendContactFormEmail( data );
        res.status( 200 ).json( {
            success: true,
            message: 'Contact form submitted successfully'
        } );
    }
}
