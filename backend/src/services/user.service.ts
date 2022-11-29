import { PrismaClient } from '@prisma/client'
import IToken from '../interfaces/IToken';
import IError from '../interfaces/IError';
import { User } from '../schemas/schemas';
import Jwt from '../utils/tokenGenerator';
import { hash, compareHash} from '../utils/hashPassword';
import { validateFieldsUser, validateFieldsLoginUser } from '../utils/validateFields';
import UserAlreadyRegistered from '../utils/userAlreadyRegistered';
import IUser from '../interfaces/IUser';

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
      err
    });

    if(!accountByUser) throw { code: 401, message: 'Conta não encontrada' };

    return accountByUser.balance;
  };

  public cashOut = async (debitedAccountId: number, creditedAccountId: number, value: number) => {
    const balance = await this.getBalance(debitedAccountId);

    if ( balance < value || balance === 0) {
      throw { code: 401, message: 'Saldo insuficiente para efetuar transferência' };
    };

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
        err;
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
