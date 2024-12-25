import { Router } from 'express';
import { ContactFormData } from '../types/common.types';
import { MailService } from '../services/mail.service';

const router = Router();

router.post( '/', async ( req, res ) => {
    const data = req.body as ContactFormData;
    const mailService = new MailService();
    await mailService.sendContactFormEmail( data );
    res.json( { success: true } );
} );

export { router as contactRoutes };
