import { z } from "zod";

// const pattern = '^(?=.*[0-9])(?=.*[A-Z])[a-zA-Z0-9]$';
// const regexExp = new RegExp(pattern);

// console.log(regexExp, ' regex');


const numMinUsername = 3;
const numMinPassword = 8

const messages = {
  minUsername: "Usuário precisa ter pelo menos 3 caracteres",
  minLogin: "Senha precisa ter pelo menos 8 caracteres",
  numAndUpCase: "Senha precisa ter um número e uma letra maiúscula"
}

export const UserSchema = z.object({
    username: z.string({ required_error: 'Username é obrigatório'}).min(numMinUsername, messages.minUsername),
    password: z.string({ required_error: 'Password é obrigatório'}).min(numMinPassword, messages.minLogin), //.regex(regexExp, { message: messages.numAndUpCase }),
  })

  export type User = z.infer<typeof UserSchema>;
