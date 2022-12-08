import axios from "axios";
import React, { useEffect, useState } from "react"

type Props = {
  extract: Transaction,
  username: string | undefined,
}

export default function RowGenerate({extract, username}: Props) {
  const token = localStorage.getItem('token');
  const Authorization = JSON.parse(token || '');

  const getCreditUsernameURL = 'http://localhost:3001/user/credit';
  const getDebitUsernameURL = 'http://localhost:3001/user/debit';

  const [creditUser, setCreditUser] = useState<IUser>();
  const [debitUser, setDebitUser] = useState<IUser>();

  const {id, debitedAccountId, creditedAccountId, value, createdAt } = extract;

  useEffect(() => {
    axios.get(getCreditUsernameURL, { headers: { Authorization, creditaccid: creditedAccountId }})
    .then((response) => {
      setCreditUser(response.data);
    })
    .catch((err) => console.log(err)
    );

    axios.get(getDebitUsernameURL, { headers: { Authorization, debitaccid: debitedAccountId }})
    .then((response) => {
      setDebitUser(response.data);
    })
    .catch((err) => console.log(err)
    );
  }, [debitedAccountId, creditedAccountId, Authorization])


  const valor = `IT$ ${value},00`;

  const date = new Date(createdAt);
  const formatedDate = date.toLocaleDateString();
  const formatedTime = date.toLocaleTimeString();

  return (
    <tr className="transaction" key={id}>
      <td className={debitUser?.username === username ? 'debit-transaction' : 'credit-transaction'} >{id}</td>
      <td className={debitUser?.username === username ? 'debit-transaction' : 'credit-transaction'} >{debitUser && debitUser.username}</td>
      <td className={debitUser?.username === username ? 'debit-transaction' : 'credit-transaction'} >{creditUser && creditUser.username}</td>
      <td className={debitUser?.username === username ? 'debit-transaction' : 'credit-transaction'} >{valor}</td>
      <td className={debitUser?.username === username ? 'debit-transaction' : 'credit-transaction'} >{formatedDate}</td>
      <td className={debitUser?.username === username ? 'debit-transaction' : 'credit-transaction'} >{formatedTime}</td>
    </tr>
  )
}