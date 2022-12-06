import { Account, PrismaClient } from '@prisma/client'
import { hash, compareHash} from '../utils/hashPassword';
import { validateFieldsUser, validateFieldsLoginUser } from '../utils/validateFields';
import { User } from '../schemas/schemas';
import UserAlreadyRegistered from '../utils/userAlreadyRegistered';
import IToken from '../interfaces/IToken';
import IError from '../interfaces/IError';
import IUser from '../interfaces/IUser';
import Jwt from '../utils/tokenGenerator';
import { Request } from 'express-serve-static-core';

const prisma = new PrismaClient();
const userAlreadyRegistered = new UserAlreadyRegistered();

export default class UserService {
  public register = async (user: User): Promise<IUser | IError> => {
    validateFieldsUser(user);

    const initialbalance = 100;
    
    const createdAccount = await prisma.account.create({
      data: {
        balance: initialbalance,
      },
    });

    const { username, password } = user;

    const hashedPassword = hash(password, 8);

    await userAlreadyRegistered.verifyForRegister(username);

    const createdUser = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
        accountId: createdAccount.id
      },
    });

    const { id, accountId } = createdUser;
    
    return { id, username, accountId };
  };

  public login = async (user: User): Promise<IToken> => {
    const { username, password } = user;
    
    const userRegistered = await userAlreadyRegistered.verifyForLogin(username);
    
    validateFieldsLoginUser(user);

    const { id, accountId, password: dbPassword } = userRegistered;

    const matchPassword = compareHash(password, dbPassword);

    if (!matchPassword) throw { code: 401, message: 'Senha inválida' };

    const token = new Jwt().encrypt({ id, username, accountId});

    return { token } as IToken;
  };

  public getBalance = async (accountId: number): Promise<number> => {
    const accountByUser = await prisma.account.findUnique({
      where: { id: accountId }
    })
    .catch((err) => {
      console.log(err);
    });

    if(!accountByUser) throw { code: 401, message: 'Conta não encontrada' };

    return accountByUser.balance;
  };


  public getCredUsername = async (creditAccId: number): Promise<IUser> => {
    const user = await prisma.user.findUnique({
      where: { 
        accountId: creditAccId,
      },
      select: {
        id: true,
        username: true,
        accountId: true,
      }
    });
    return user as IUser;
  };

  // public exclude = (user: IUser, keys: Key[]): Promise<Omit<IUser, Key>> => {
  //   for (let key of keys) {
  //     delete user[key]
  //   }
  //   return user
  // }

  public getUserAndTransactionsInfo = async (accountId: number) => {
    const user = await prisma.user.findUnique({
      where: { 
        accountId
      },
      select: {
        id: true,
        username: true,
        accountId: true,
        account: {
          include: {
            debitedTransactions: true,
            creditedTransactions: true
          }
        },
      }
    });
    return user;
  };

  public cashOut = async (debitedAccountId: number, creditedAccountId: number, value: number): Promise<Account | undefined> => {
    const balance = await this.getBalance(debitedAccountId);

    if (balance === 0 || balance < value) throw { code: 401, message: 'Saldo insuficiente para efetuar transferência' }
    
    if (balance >= value ) {
      const updatedBalance = await prisma.account.update({
        where: {
          id: debitedAccountId,
        },
        data: {
          balance: balance - value,
        },
      })
      .catch((err) => {
        console.log(err);
      });
      
      if (!updatedBalance) throw { code: 401, message: 'Não foi possível fazer a transferência' };

      await this.cashIn(creditedAccountId, value);

      return updatedBalance;
    };

  };

  protected cashIn = async (creditedAccountId: number, value: number) => {
    const balance = await this.getBalance(creditedAccountId);
    await prisma.account.update({
      where: {id: creditedAccountId},
      data: {
        balance: balance + value,
      },
  });

  }
};
