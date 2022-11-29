declare module "*.png"

interface IError {
  code: number;
  message: string;
}

interface IToken {
  token: string
};

interface cahsOutOrIn {
  id: number;
  debitedAccountId: number;
  creditedAccountId: number;
  value: number;
  createdAt: date
};

interface TransactionSend {
  creditedAccountId: number;
  value: number;
}
