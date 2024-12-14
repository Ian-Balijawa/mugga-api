import { BaseService } from './base.service';
import { LoanOfficer } from '../entities/loan-officer.entity';
import { AppDataSource } from '../config/database.config';
import { AppError } from '../middlewares/error-handler.middleware';

export class LoanOfficerService extends BaseService<LoanOfficer> {
  constructor() {
    super(AppDataSource.getRepository(LoanOfficer));
  }

  async findWithBorrowers(id: string): Promise<LoanOfficer> {
    const loanOfficer = await this.repository.findOne({
      where: { id },
      relations: ['borrowers']
    });
    if (!loanOfficer) {
      throw new AppError(404, 'Loan officer not found');
    }
    return loanOfficer;
  }

  async findByUserId(userId: string): Promise<LoanOfficer | null> {
    return this.repository.findOne({
      where: { user: { id: userId } },
      relations: ['user']
    });
  }
}
