import { PrismaClient } from '@prisma/client'
import { Request } from 'express';
import UserService from './user.service';
import validateAuthorization from '../middlewares/authMiddleware';
import { validateFieldsTransaction } from '../utils/validateFields';
import userAlreadyRegistered from '../utils/userAlreadyRegistered';

const prisma = new PrismaClient();

export default class TransactionService {
  constructor(private userService = new UserService()) {}

  public transaction = async (req: Request) => {
    validateFieldsTransaction(req.body);

    const { authorization } = req.headers;
    const { creditedAccountId, value } = req.body;

    if (!authorization) throw { code: 401, message: 'Token inválido'};

    const debitedUser = validateAuthorization(authorization);

    const { accountId: debitedAccountId,  } = debitedUser;

    if (debitedAccountId === creditedAccountId) throw { code: 401, message: 'Não é possível transferir para própria conta' };

    await this.userService.cashOut(debitedAccountId, creditedAccountId, value);
    
    const transaction = await prisma.transaction.create({
      data: {
        debitedAccountId,
        creditedAccountId,
        value,
      },
    });
    return transaction;
  };
}
