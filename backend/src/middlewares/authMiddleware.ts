import { Request } from 'express';
import Jwt from '../utils/tokenGenerator';

export default class AuthMiddleware {
  public validateAuthorization(req: Request) {
    const jwt = new Jwt();

    if (!req.headers.authorization) throw { code: 401, message:  'É nescessário um token válido' };
    
    const { authorization } = req.headers;

    const tokenDecrypt = jwt.decrypt(authorization);

    return tokenDecrypt;
  };
};
