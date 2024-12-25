import { AppDataSource } from '../config/database.config';
import { NewsLetterSubscription } from '../entities/news-letter-subscriptions';
import { BaseService } from './base.service';

export class NewsletterService extends BaseService<NewsLetterSubscription> {
    constructor() {
        super( AppDataSource.getRepository( NewsLetterSubscription ) );
    }

    async subscribe( email: string ): Promise<NewsLetterSubscription> {
        const existing = await this.repository.findOne( { where: { email } } );

        if ( existing && !existing.deletedAt ) {
            throw new Error( 'Email already subscribed' );
        }

        if ( existing ) {
            existing.deletedAt = null;
            return this.repository.save( existing );
        }

        const subscription = this.repository.create( { email } );
        return this.repository.save( subscription );
    }

    async unsubscribe( email: string ): Promise<void> {
        const subscription = await this.repository.findOne( { where: { email } } );

        if ( !subscription || subscription.deletedAt ) {
            throw new Error( 'Subscription not found' );
        }

        await this.repository.softDelete( { email } );
    }
}
