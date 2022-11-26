import { PrismaClient } from '@prisma/client'
import { Request } from 'express';
import IToken from '../interfaces/IToken';
import IError from '../interfaces/IError';
import { User } from '../schemas/schemas';
import Jwt from '../utils/tokenGenerator';
import { hash, compareHash} from '../utils/hashPassword';
import validateUser from '../middlewares/validateUser';
import IUser from '../interfaces/IUser';

const prisma = new PrismaClient();

export default class UserService {

  public register = async (user: User): Promise<IUser | IError> => {
    validateUser(user);

    const initialbalance = 100;
    
    const createdAccount = await prisma.account.create({
      data: {
        balance: initialbalance,
      },
    });

    const { username, password } = user;

    const hashedPassword = hash(password, 8);

    const userAlreadyExists = await prisma.user.findFirst({
      where: { username },
    });

    if (userAlreadyExists) throw { code: 401, message: 'Usuário já existe' };

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
    validateUser(user);

    const { username, password } = user;

    const userAlreadyRegistered = await prisma.user.findFirst({
      where: { username },
    })
    .catch((err) => {
      err
    });

    if (!userAlreadyRegistered) throw { code: 401, message: 'Usuário não cadastrado' };

    const { id, accountId, password: dbPassword } = userAlreadyRegistered;

    const matchPassword = compareHash(password, dbPassword);

    if (!matchPassword) throw { code: 401, message: 'Senha inválida' };

    const token = new Jwt().encrypt({ id, username, accountId});

    return { token } as IToken;
  };

  public getBalance = async (accountId: number): Promise<number> => {
    const accountByUser = await prisma.account.findUnique({
      where: { id: accountId }
    });

    if(!accountByUser) throw { code: 401, message: 'Conta não encontrada' };

    return accountByUser.balance;
  };
};
