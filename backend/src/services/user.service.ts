import { PrismaClient } from '@prisma/client'
import { Request } from 'express';
import IToken from '../interfaces/IToken';
import IError from '../interfaces/IError';
import { User } from '../schemas/schemas';
import Jwt from '../utils/tokenGenerator';
import HashPassword from '../utils/hashPassword';
import Validations from '../middlewares/validations';
import IUser from '../interfaces/IUser';

const prisma = new PrismaClient();

export default class UserService {
  public register = async (user: User): Promise<IUser | IError> => {

    new Validations().validatedUser(user);

    const initialbalance = 100;
    
    const createdAccount = await prisma.account.create({
      data: {
        balance: initialbalance,
      },
    });

    const { username, password } = user;

    const hashPassword = new HashPassword();

    const hashedPassword = hashPassword.hash(password, 8);

    const userAlreadyExists = await prisma.user.findFirst({
      where: { username }
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

  public login = async (req: Request): Promise<IToken> => {
    const user: User = req.body;

    new Validations().validatedUser(user);

    const { username, password } = user;
    
    const userAlreadyRegistered = await prisma.user.findFirst({
      where: { username }
    })
    .catch((err) => {
      err
    });
    
    if (!userAlreadyRegistered) throw { code: 401, message: 'Usuário não cadastrado' };

    const hashPassword = new HashPassword();
    
    const { id, accountId, password: dbPassword } = userAlreadyRegistered;

    const matchPassword = hashPassword.compareHash(password, dbPassword)
    
    if (!matchPassword) throw { code: 401, message: 'Senha inválida' };

    const jwt = new Jwt();

    const token = jwt.encrypt({ id, username, accountId})

    req.headers.Authorization = token;

    return { token } as IToken;
  }
}