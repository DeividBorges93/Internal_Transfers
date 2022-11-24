import { PrismaClient } from '@prisma/client'
import IError from '../interfaces/IError';
import { User, UserSchema } from '../schemas/schemas';
import HashPassword from '../utils/hashPassword';
import IUser from '../interfaces/IUser';

const prisma = new PrismaClient();

export default class UserService {
  public register = async (user: User): Promise<IUser | IError> => {

    const validatedUser = await UserSchema.safeParseAsync(user)
    
    if (validatedUser.success === false) throw {code: 401, message: validatedUser.error.issues[0].message} as IError;
    
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
  }
}