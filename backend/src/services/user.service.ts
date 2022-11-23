import { User, PrismaClient } from '@prisma/client'
import InvalidUser from '../customErrors/InvalidUser';

const prisma = new PrismaClient();

export default class UserService {
  public register = async (user: User): Promise<User | InvalidUser> => {
    
    const { username, password } = user;

    if (!username || !password) throw new InvalidUser('Todos os campos são obrigatórios');

    const userAlreadyExists = await prisma.user.findFirst({
      where: { username }
    });
    
    if (userAlreadyExists) throw new InvalidUser('Usuário já existe');

      const createdAccount = await prisma.account.create({
        data: {
          balance: 100
        },
      });
      const createdUser = await prisma.user.create({
        data: {
          username: username,
          password: password,
          accountId: createdAccount.id
        },
      });
      return createdUser;
  }
}