# Boas-vindas ao front-end do repositório Internal Transfers!

## Intuito da aplicação
  - Criar telas para consumir a API Internal Transfers

## Features

- [x] Tela de criação de usuário.
- [x] Tela de login de usuário.
- [x] Tela para transferências e relatórios

## Pré-requisitos para rodar a aplicação Backend

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas: [![Git Badge](https://img.shields.io/badge/-Git-black?style=flat-square&logo=git)](https://git-scm.com) [![npm Badge](https://img.shields.io/badge/-npm-black?style=flat-square&logo=Node.js)](https://www.npmjs.com/)

- Clone o repositório
~~~Java
git@github.com:DeividBorges93/Internal_Transfers.git
~~~

- Entre na pasta do frontend
~~~Java
cd /Internal_Transfers/frontend
~~~

- Instale as dependencias
~~~Java
npm install
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

## Páginas

- Cadastro de usuário - 
> /user/regsiter - usuário no minimo 3 e senha no mínimo 8 caracters, um número e uma letra maiúscula
~~~Java
Recebe:

  "username": "seu.usuario",
  "password": "Su4.senha"
~~~

- Login de usuário - requer username válido.
> /user/login - usuário no minimo 3 e senha no mínimo 8 caracters, um número e uma letra maiúscula
~~~Java
Recebe:

  "username": "seu.usuario",
  "password": "Su4.senha"
~~~

 - Transferencia para um usuário - requer token e username válidos.
> /transaction
~~~Java
Recebe:

  "creditedAccountId": 3,
  "value": 70

Retorna:

  "id": 18,
  "debitedAccountId": 2,
  "creditedAccountId": 3,
  "value": 70,
  "createdAt": "2022-11-29T02:27:12.470Z"
~~~

 - Lista de saídas de IT$ - requer token e username válidos.
> /transactions/debited
~~~Java
Resposta da requisição:

    "id": 13,
    "debitedAccountId": 5,
    "creditedAccountId": 3,
    "value": 1,
    "createdAt": "2022-11-28T03:51:11.490Z"

    "id": 9,
    "debitedAccountId": 5,
    "creditedAccountId": 6,
    "value": 100,
    "createdAt": "2022-11-28T03:35:20.636Z"

    "id": 8,
    "debitedAccountId": 5,
    "creditedAccountId": 3,
    "value": 1,
    "createdAt": "2022-11-28T03:34:47.828Z"
~~~

- Lista de entradas de IT$ - requer token e username válidos.
> /transactions/credited
~~~Java
Resposta da requisição:


    "id": 11,
    "debitedAccountId": 8,
    "creditedAccountId": 5,
    "value": 50,
    "createdAt": "2022-11-28T03:47:13.898Z"

    "id": 10,
    "debitedAccountId": 2,
    "creditedAccountId": 5,
    "value": 50,
    "createdAt": "2022-11-28T03:45:36.694Z"
~~~