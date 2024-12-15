import { BaseService } from './base.service';
import { Registration } from '../entities/registration.entity';
import { AppDataSource } from '../config/database.config';
import { MoreThanOrEqual } from 'typeorm';
import { Program } from '../entities/program.entity';

export class RegistrationService extends BaseService<Registration> {
    private programRepository = AppDataSource.getRepository( Program );

    constructor() {
        super( AppDataSource.getRepository( Registration ) );
    }

    async findByProgram( programId: string ): Promise<Registration[]> {
        return this.repository.find( {
            where: { program: { id: programId } },
            relations: ['program'],
            order: { createdAt: 'DESC' }
        } );
    }

    async findByEmail( email: string ): Promise<Registration[]> {
        return this.repository.find( {
            where: { email },
            relations: ['program'],
            order: { startDate: 'DESC' }
        } );
    }

    async findUpcoming(): Promise<Registration[]> {
        const today = new Date();
        return this.repository.find( {
            where: {
                startDate: MoreThanOrEqual( today )
            },
            relations: ['program'],
            order: { startDate: 'ASC' }
        } );
    }

    async checkProgramAvailability( programId: string ): Promise<boolean> {
        const registrations = await this.repository.count( {
            where: { program: { id: programId } }
        } );
        const program = await this.programRepository.findOneOrFail( { where: { id: programId } } );
        return registrations < program.maxParticipants;
    }
}
