import { NextFunction, Request, Response } from 'express';
import TransactionService from '../services/transaction.service';

export default class TransactionController {
  constructor( private transactionService = new TransactionService()) {};

  public transaction = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await this.transactionService.transaction(req);

    return res.status(200).json(transaction);
  };

  public getTransactions = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) throw { code: 401, message: 'Token inválido'};

    const transactions = await this.transactionService.getTransactions(authorization);

    return res.status(200).json(transactions);
  }


  public getCashOut = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) throw { code: 401, message: 'Token inválido'};

    const cashOutList = await this.transactionService.getCashOut(authorization);

    return res.status(200).json(cashOutList);
  };

  public getCashIn = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) throw { code: 401, message: 'Token inválido'};

    const cashInList = await this.transactionService.getCashIn(authorization);

    return res.status(200).json(cashInList);
  };
}