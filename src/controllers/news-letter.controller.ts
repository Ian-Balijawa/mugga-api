import { BaseController } from './base.controller';
import { NewsletterService } from '../services/news-letter.service';
import { Request, Response } from 'express';
import { NewsLetterSubscription } from '../entities/news-letter-subscriptions';
import { MailService } from '../services/mail.service';

export class NewsLetterController extends BaseController<NewsLetterSubscription> {
    private mailService: MailService;

    constructor() {
        super( new NewsletterService() );
        this.mailService = new MailService();
    }

    async subscribe( req: Request, res: Response ) {
        const { email } = req.body;
        const subscription = await this.service.create( { email } );
        await this.mailService.sendNewsLetterSubscriptionEmail( email );
        res.status( 200 ).json( subscription );
    }

    async unsubscribe( req: Request, res: Response ) {
        const { email } = req.body;
        const subscription = await this.service.delete( email );
        await this.mailService.sendNewsLetterUnsubscriptionEmail( email );
        res.status( 200 ).json( subscription );
    }
}
