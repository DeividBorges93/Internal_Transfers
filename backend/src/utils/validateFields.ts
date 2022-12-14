import { User, UserSchema, Transaction, TransactionSchema, UserLoginSchema } from '../schemas/schemas';
import IError from '../interfaces/IError';

export const validateFieldsUser = (user: User) => {
  const validatedUser = UserSchema.safeParse(user);

  if (validatedUser.success === false) throw {code: 401, message: validatedUser.error.issues[0].message} as IError;
};

export const validateFieldsLoginUser = (user: User) => {
  const validatedUser = UserLoginSchema.safeParse(user);

  if (validatedUser.success === false) return {code: 401, message: validatedUser.error.issues[0].message} as IError;
};

export const validateFieldsTransaction = (transactionInfo: Transaction) => {
  const validatedTransaction = TransactionSchema.safeParse(transactionInfo);

  if (validatedTransaction.success === false) throw {code: 401, message: validatedTransaction.error.issues[0].message} as IError;
};
