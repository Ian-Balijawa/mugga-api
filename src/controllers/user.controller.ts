import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { userSchema } from '../validators/user.validator';


export class UserController {
  private userService = new UserService();

  async create( req: Request, res: Response ): Promise<void> {
    const data = await userSchema.parseAsync( req.body );
    const user = await this.userService.create( data );
    res.status( 201 ).json( user );
  }

  async findAll( _req: Request, res: Response ): Promise<void> {
    const users = await this.userService.findAll();
    res.json( users );
  }

  async findById( req: Request, res: Response ): Promise<void> {
    const user = await this.userService.findById( req.params.id );
    res.json( user );
  }

  async update( req: Request, res: Response ): Promise<void> {
    const data = await userSchema.partial().parseAsync( req.body );
    const user = await this.userService.update( req.params.id, data );
    res.json( user );
  }

  async delete( req: Request, res: Response ): Promise<void> {
    await this.userService.delete( req.params.id );
    res.status( 204 ).send();
  }
}
