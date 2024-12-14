import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AppError } from './error-handler.middleware';
import { UserContext } from '../types/common.types';
import { LoanOfficerService } from '../services/loan-officer.service';

declare global {
  namespace Express {
    interface Request {
      user?: UserContext;
    }
  }
}

const authService = new AuthService();
const loanOfficerService = new LoanOfficerService();

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new AppError(401, 'No token provided');
    }

    const userContext = await authService.validateToken(token);
    const loanOfficer = await loanOfficerService.findByUserId(userContext.userId);

    if (loanOfficer && !loanOfficer.isActive && !loanOfficer.isAdmin) {
      throw new AppError(403, 'Account is not activated');
    }

    req.user = userContext;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError(401, 'Not authenticated');
    }

    const hasRole = req.user.roles.some(role => roles.includes(role));
    if (!hasRole) {
      throw new AppError(403, 'Not authorized');
    }

    next();
  };
};
