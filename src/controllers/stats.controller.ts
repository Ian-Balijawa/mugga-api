import { Request, Response } from 'express';
import { StatsService } from '../services/stats.service';

export class StatsController {
    private statsService: StatsService;

    constructor() {
        this.statsService = new StatsService();
    }

    async getStats( _req: Request, res: Response ): Promise<void> {
        const stats = await this.statsService.getStats();
        res.json( {
            success: true,
            data: stats
        } );
    }
}
