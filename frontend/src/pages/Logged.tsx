import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function Logged() {
  const navigate = useNavigate();

  const [balance, setBalance] = useState<number>();
  const [cashOuts, setCashOut] = useState<cahsOutOrIn[]>();
  const [cashIns, setCashIn] = useState<cahsOutOrIn[]>();
  // const [formatedDate, setFormatedDate] = useState<string>();

  const getBalanceURL = 'http://localhost:3001/user/balance';
  const getCashOutURL = 'http://localhost:3001/transactions/debited';
  const getCashInURL = 'http://localhost:3001/transactions/credited';
  const sendTransferURL = 'http://localhost:3001/transaction';
  
  useEffect(() => {
    axios.get(getBalanceURL, { headers: { Authorization }})
      .then((response) => {
        setBalance(response.data);
      })
      .catch((err) => err);
      
    axios.get(getCashOutURL, { headers: { Authorization }})
      .then((response) => {
        setCashOut(response.data);
      })
      .catch((err) => err);

    axios.get(getCashInURL, { headers: { Authorization }})
      .then((response) => {
        setCashIn(response.data);
      })
      .catch((err) => err);
  }, [])


  const token = localStorage.getItem('token');
  const Authorization = JSON.parse(token || '');

  const username = JSON.parse(localStorage.getItem('username') || '');

  const logout = async () => {
    navigate('/user/login');
    localStorage.setItem('token', JSON.stringify(''));
    localStorage.setItem('username', JSON.stringify(''));
  };

  const refCreditedId = useRef<HTMLInputElement>(null);
  const refValueTransfer = useRef<HTMLInputElement>(null);

  const sendTransfer = async (transaction: TransactionSend) => {
    await axios.post(sendTransferURL, transaction, { headers: { Authorization }})
      .then((response) => console.log(response)
      )
      .catch((err) => console.log(err)
      );
  };

  const getValues = async () => {
    if (refCreditedId.current && refValueTransfer.current) {
      const transaction = {
        creditedAccountId: Number(refCreditedId.current.value),
        value: Number(refValueTransfer.current.value),
      }
      sendTransfer(transaction);
    }
  }

  return (
    <div className="container">
      <div className="container-logged">
        <header className="header-logged">
          <div className="actual-balance">
            <span className="balance">{`Saldo atual R$ ${balance}`}</span>
          </div>
          <div className="actual-username">
            <span className="username">{`Logado com ${username}`}</span>
          </div>
          <button className="logout-btn" onClick={ logout }>Sair</button>
        </header>
          <div className="transaction">
            <h1>Transferência</h1>
            <form className="transaction-form" onSubmit={ getValues }>
              <input className="input debited-account-id"
                type="text"
                value={username}
                readOnly
              />
              <input className="input credited-account-id"
                type="number"
                ref={refCreditedId}
                placeholder="ID que receberá o saldo"
              />
              <input className="input value-transfer"
                type="number"
                ref={refValueTransfer}
                placeholder="Valor da transferência"
              />
              <button className="enviar-transferencia"
                type="submit"
              >
                Transferir
              </button>
            </form>
          </div>
          <div className="cashout-container">
            <h1>Saída de IT Ca$h</h1>
            <table className="cashout-list">
            <thead>
              <tr>
                <th>ID</th>
                <th>Conta debitada</th>
                <th>Conta creditada</th>
                <th>Valor da transação</th>
                <th>Data da transação</th>
              </tr>
            </thead>
            <tbody>
            {cashOuts?.map(({ id, debitedAccountId, creditedAccountId, value, createdAt}, i) => (
              <tr key={i}>
                <td>{id}</td>
                <td>{debitedAccountId}</td>
                <td>{creditedAccountId}</td>
                <td>{value}</td>
                <td>{createdAt}</td>
              </tr>
            ))}
            </tbody>
          </table>
          </div>
          <div className="cashin-container">
            <h1>Entrada de IT Ca$h</h1>
            <table className="cashout-list">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Conta debitada</th>
                  <th>Conta creditada</th>
                  <th>Valor da transação</th>
                  <th>Data da transação</th>
                </tr>
              </thead>
              <tbody>
              {cashIns?.map(({ id, debitedAccountId, creditedAccountId, value, createdAt}, i) => (
                <tr key={i}>
                  <td>{id}</td>
                  <td>{debitedAccountId}</td>
                  <td>{creditedAccountId}</td>
                  <td>{value}</td>
                  <td>{createdAt}</td>
                </tr>
              ))}
              </tbody>
          </table>
          </div>
      </div>
    </div>
  )
}