import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity( 'news_letter_subscriptions' )
export class NewsLetterSubscription extends BaseEntity {
    @Column()
    email: string;
}
