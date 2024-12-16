import { AppDataSource } from '../config/database.config';
import { Coach } from '../entities/coach.entity';
import { Facility } from '../entities/facility.entity';
import { Program } from '../entities/program.entity';
import { Post } from '../entities/post.entity';
import { Registration } from '../entities/registration.entity';
import { GalleryItem } from '../entities/gallery-item.entity';
import { ActivityLogService } from '../services/activity-log.service';
import { ActivityLog } from '../entities/activity-log.entity';

export class StatsService {
    private coachRepository = AppDataSource.getRepository( Coach );
    private facilityRepository = AppDataSource.getRepository( Facility );
    private programRepository = AppDataSource.getRepository( Program );
    private postRepository = AppDataSource.getRepository( Post );
    private registrationRepository = AppDataSource.getRepository( Registration );
    private galleryRepository = AppDataSource.getRepository( GalleryItem );
    private activityLogService: ActivityLogService;

    constructor() {
        this.activityLogService = new ActivityLogService();
    }

    async getStats(): Promise<{
        counts: {
            coaches: number;
            facilities: number;
            programs: number;
            posts: number;
            registrations: number;
            galleryItems: number;
            activePrograms: number;
        };
        recentActivities: ActivityLog[];
    }> {
        const [
            coaches,
            facilities,
            programs,
            posts,
            registrations,
            galleryItems,
            activePrograms,
            recentActivities
        ] = await Promise.all( [
            this.coachRepository.count(),
            this.facilityRepository.count(),
            this.programRepository.count(),
            this.postRepository.count(),
            this.registrationRepository.count(),
            this.galleryRepository.count(),
            this.programRepository.count( { where: { isActive: true } } ),
            this.activityLogService.getRecentLogs( 20 )
        ] );

        return {
            counts: {
                coaches,
                facilities,
                programs,
                posts,
                registrations,
                galleryItems,
                activePrograms
            },
            recentActivities
        };
    }
}
