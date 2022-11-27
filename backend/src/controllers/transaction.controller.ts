import { NextFunction, Request, Response } from 'express';
import TransactionService from '../services/transaction.service';

export default class TransactionController {
  constructor( private transactionService = new TransactionService()) {};

  public transaction = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await this.transactionService.transaction(req);

    return res.status(200).json(transaction);
  };
}