import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import Jwt from '../utils/tokenGenerator';

export default class AuthMiddleware {
  public validateAuthorization(req: Request) {
    const jwt = new Jwt();
    const { authorization } = req.headers;

    if (!authorization) throw { code: 401, message:  'É nescessário um token válido' }

    const tokenDecrypt = jwt.decrypt(authorization);

    return tokenDecrypt;
  }
}
