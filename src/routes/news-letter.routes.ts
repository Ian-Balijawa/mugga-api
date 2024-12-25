import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { NewsLetterController } from '../controllers/news-letter.controller';

const router = Router();
const controller = new NewsLetterController();

const newsletterLimiter = rateLimit( {
    windowMs: 15 * 60 * 1000,
    max: 5
} );

router.post( '/subscribe',
    newsletterLimiter,
    controller.subscribe.bind( controller )
);

router.post( '/unsubscribe',
    newsletterLimiter,
    controller.unsubscribe.bind( controller )
);

export { router as newsLetterRoutes };
