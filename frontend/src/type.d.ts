declare module "*.png"

interface IError {
  code: number;
  message: string;
};

interface IToken {
  token: string
};

interface TransactionSend {
  creditedAccountId: number;
  value: number;
};

interface Transaction {
  id: number;
  debitedAccountId: number;
  creditedAccountId: number;
  value: number;
  createdAt: date;
};

interface IUser {
  id: number;
  username: string;
  accountId: number;
};

interface IUserWithPass extends IUser{
  password: string;
};

interface IAccount {
  id: number;
  balance: string;
  creditedTransactions: Transaction[]
  debitedTransactions: Transaction[]
};

interface UserAllFields extends IUser{
  account: IAccount
};