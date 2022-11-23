import { NextFunction, Request, Response } from 'express';
import IError from '../interfaces/IError';

const errorMiddleware = (error: IError, _req: Request, res: Response, _next: NextFunction) => {
  if (error.code) return res.status(error.code).json({ message: error.message });

  console.error(error);

  return res.status(500).json(error);
};

export default errorMiddleware;
