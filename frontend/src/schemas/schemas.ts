import { z } from "zod";

const needANumber = '(?=.*[0-9])'
const regexNeedANumber = new RegExp(needANumber);

const needAUpCase = '(?=.*[A-Z])';
const regexneedAUpCase = new RegExp(needAUpCase);

const numMinUsername = 3;
const numMinPassword = 8

const messages = {
  minUsername: "Usuário precisa ter pelo menos 3 caracteres",
  minLogin: "Senha precisa ter pelo menos 8 caracteres",
  minOneNumber: "Senha precisa ter um número",
  oneUpCase: "Senha precisa ter uma letra maiúscula"
}

export const UserSchema = z.object({
    username: z.string({ required_error: 'Username é obrigatório' }).min(numMinUsername, messages.minUsername),
    password: z.string({ required_error: 'Password é obrigatório'})
      .min(numMinPassword, messages.minLogin)
      .regex(regexNeedANumber, { message: messages.minOneNumber })
      .regex(regexneedAUpCase, { message: messages.oneUpCase }),
  });

export const UserLoginSchema = z.object({
  username: z.string({ required_error: 'Username é obrigatório' }),
  password: z.string({ required_error: 'Password é obrigatório'})
});

export type User = z.infer<typeof UserSchema>;

export const TransactionSchema = z.object({
  creditedAccountId: z.number({ required_error: 'CreditedAccountId é obrigatório' }),
  value: z.number({ required_error: 'Value é obrigatório' }),
});

export type Transaction = z.infer<typeof TransactionSchema>;
