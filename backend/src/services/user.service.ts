import { PrismaClient } from '@prisma/client'
import IUser from '../interfaces/IUser';
import IError from '../interfaces/IError';

const prisma = new PrismaClient();

export default class UserService {
  public register = async (user: IUser): Promise<IUser | IError> => {
    
    if (!user) return { code: 400, message: 'Invalid fields' };

    const createdAccount = await prisma.account.create({
      data: {
        balance: 100
      },
    });
    const createdUser = await prisma.user.create({
      data: {
        username: user.username,
        password: user.password,
        accountId: createdAccount.id
      },
    });
    return createdUser;
  }
}