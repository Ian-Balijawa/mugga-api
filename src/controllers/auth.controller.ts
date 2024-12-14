import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private authService = new AuthService();

  async forgotPassword( req: Request, res: Response ): Promise<void> {
    const { email } = req.body;
    const securityCode = await this.authService.initiatePasswordReset( email );
    res.json( { message: 'Password reset initiated', securityCode } );
  }

  async verifyEmail( req: Request, res: Response ): Promise<void> {
    const { email, otp } = req.body;
    await this.authService.verifyEmail( email, otp );
    res.status( 200 ).json( { message: 'Email verified successfully' } );
  }

  async verifyPhone( req: Request, res: Response ): Promise<void> {
    const { phone, otp } = req.body;
    await this.authService.verifyPhone( req.user!.userId, phone, otp );
    res.status( 200 ).json( { message: 'Phone verified successfully' } );
  }

  async changePassword( req: Request, res: Response ): Promise<void> {
    const { currentPassword, newPassword } = req.body;
    await this.authService.changePassword( req.user!.userId, currentPassword, newPassword );
    res.status( 200 ).json( { message: 'Password changed successfully' } );
  }

  async verifySecurityCode( req: Request, res: Response ): Promise<void> {
    const { email, code } = req.body;
    await this.authService.verifySecurityCode( email, code );
    res.status( 200 ).json( { message: 'Security code verified successfully' } );
  }

  async resetPassword( req: Request, res: Response ): Promise<void> {
    const { email, newPassword, otp } = req.body;
    await this.authService.resetPassword( email, newPassword, otp );
    res.status( 200 ).json( { message: 'Password reset successfully' } );
  }

  async signup( req: Request, res: Response ): Promise<void> {
    const { firstName, lastName, email, phone, password, employeeId, isAdmin = false } = req.body;
    const loanOfficer = await this.authService.createLoanOfficer( {
      firstName,
      lastName,
      email,
      phone,
      password,
      employeeId,
      isAdmin,
      isActive: isAdmin // Admin accounts are active by default
    } );
    res.status( 201 ).json( loanOfficer );
  }

  async signin( req: Request, res: Response ): Promise<void> {
    const { email, password } = req.body;
    const { token, user } = await this.authService.signin( email, password );
    res.status( 200 ).json( { token, user } );
  }

  async toggleActivation( req: Request, res: Response ): Promise<void> {
    const { loanOfficerId, isActive } = req.body;
    await this.authService.toggleLoanOfficerActivation( loanOfficerId, isActive );
    res.status( 200 ).json( { message: 'Activation status updated successfully' } );
  }
}
