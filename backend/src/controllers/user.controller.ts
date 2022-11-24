import { NextFunction, Request, Response } from 'express';
import UserService from '../services/user.service';

export default class UserController {
  constructor(private userService = new UserService()) {}

  public register = async (req: Request, res: Response, next: NextFunction) => {
    const result = await this.userService.register(req.body);

    return res.status(200).json(result);
  }
}