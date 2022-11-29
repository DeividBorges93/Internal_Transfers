# Boas-vindas a API Internal Transfers!
 - Uma API para realização de transferência de valores entre usuários.
 - Rota para cadastro de usuário
 - Rota para login de usuário
 - Rota para fazer uma transação
 - Rotas para pegar as transações feitas

## Features

- [x] Criação de usuário
- [x] Efetuar login
- [x] Criar, ler, transferências de valor
- [x] Filtrar projetos por cash-in, cash-out
- [x] Ordenar por data decrescente como default e botão para crescente

## Pré-requisitos para rodar a aplicação Backend

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas: [![Git Badge](https://img.shields.io/badge/-Git-black?style=flat-square&logo=git)](https://git-scm.com) [![Nodejs Badge](https://img.shields.io/badge/-Nodejs-black?style=flat-square&logo=Node.js)](https://nodejs.org/en/)

- Clone o repositório
~~~Java
git@github.com:DeividBorges93/Internal_Transfers.git
~~~

- Entre na pasta do backend
~~~Java
cd /Internal_Transfers/backend
~~~


- Instale as dependencias
~~~Java
npm install
~~~

- Remove o .example do arquivo .env.example
~~~Java
API_PORT=NUM_PORT
DATABASE_URL=URL_PADRAO_PRISMA
JWT_SECRET=SECRET_PARA_O_TOKEN

~~~

## Sem Docker


- Inicie a aplicação
~~~Java
npm start
~~~

## Com Docker

- Na pasta raiz do projeto rode o comando
~~~Java
docker-compose up --build
~~~

- Teste as rotas usando a coleção feita na pasta thunderClient ou use um de sua preferência.

~~~Java
backend/thunderClient
~~~

## End points

- POST - Cadastro de usuário 
> http://localhost:3001/user/register
~~~Java
Corpo da requisição:

{
"username": "deivid.borges",
"password": "Minhasenh4"
}
~~~
~~~Java
Resposta da requisição:

{
  "id": 2,
  "username": "deivid.borges",
  "accountId": 2
}
~~~

- POST - Login de usuário - requer username válido.
> http://localhost:3001/user/login - usuário no minimo 3 e senha no mínimo 8 caracters, um número e uma letra maiúscula
~~~Java
Corpo da requisição:
{
"username": "seu.usuario",
"password": "Su4.senha"
}
~~~
~~~Java
Resposta da requisição:

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJkZWl2aWQubWIzIiwiYWNjb3VudElkIjo1LCJpYXQiOjE2Njk2ODg0MTMsImV4cCI6MTY2OTc3NDgxM30.J4Q48_K7498aMw7YetlpI0lGaHOgO-nSVVSMJnO42ZY
~~~

 POST - Transferencia para um usuário - requer token e username válidos.
> http://localhost:3001/transaction
~~~Java
Corpo da requisição:

{
  "creditedAccountId": 3,
  "value": 70
}
~~~
~~~Java
Resposta da requisição:

{
  "id": 18,
  "debitedAccountId": 2,
  "creditedAccountId": 3,
  "value": 70,
  "createdAt": "2022-11-29T02:27:12.470Z"
}
~~~

GET - Lista de saídas de IT$ - requer token e username válidos.
> http://localhost:3001/transactions/debited
~~~Java
Resposta da requisição:

[
  {
    "id": 13,
    "debitedAccountId": 5,
    "creditedAccountId": 3,
    "value": 1,
    "createdAt": "2022-11-28T03:51:11.490Z"
  },
  {
    "id": 9,
    "debitedAccountId": 5,
    "creditedAccountId": 6,
    "value": 100,
    "createdAt": "2022-11-28T03:35:20.636Z"
  },
  {
    "id": 8,
    "debitedAccountId": 5,
    "creditedAccountId": 3,
    "value": 1,
    "createdAt": "2022-11-28T03:34:47.828Z"
  }
]
~~~

GET - Lista de entradas de IT$ - requer token e username válidos.
> http://localhost:3001/transactions/credited
~~~Java
Resposta da requisição:

[
  {
    "id": 11,
    "debitedAccountId": 8,
    "creditedAccountId": 5,
    "value": 50,
    "createdAt": "2022-11-28T03:47:13.898Z"
  },
  {
    "id": 10,
    "debitedAccountId": 2,
    "creditedAccountId": 5,
    "value": 50,
    "createdAt": "2022-11-28T03:45:36.694Z"
  }
]
~~~