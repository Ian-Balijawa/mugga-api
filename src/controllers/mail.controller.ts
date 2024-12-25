import { Request, Response } from 'express';
import { MailService } from '../services/mail.service';
import { ContactFormData } from '../types/common.types';

export class MailController {
    private mailService: MailService;

    constructor() {
        this.mailService = new MailService();
    }

    async sendContactFormEmail( req: Request, res: Response ): Promise<void> {
        const data = req.body as ContactFormData;
        await this.mailService.sendContactFormEmail( data );
        res.json( { success: true } );
    }
}
