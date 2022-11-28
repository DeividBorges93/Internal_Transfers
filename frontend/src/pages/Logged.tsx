import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import RowGenerate from "../components/RowExtracts";

export default function Logged() {
  const navigate = useNavigate();

  const [balance, setBalance] = useState<number>();
  const [cashOuts, setCashOut] = useState<cahsOutOrIn[]>([]);
  const [cashIns, setCashIn] = useState<cahsOutOrIn[]>([]);
  const [extracts, setExtracts] = useState<cahsOutOrIn[]>([]);
  const [sortExtracts, setSortExtracts] = useState<cahsOutOrIn[]>([]);

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
  }, []);

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
      };
      sendTransfer(transaction);
    }
  };

  const generateExtract = async () => {
    setCashOut([]);
    setCashIn([]);
    setSortExtracts([]);

    const cashOutExtracts = await axios.get(getCashOutURL, { headers: { Authorization }})
      .then((response) => response.data)
      .catch((err) => err);

    const cashInExtracts = await axios.get(getCashInURL, { headers: { Authorization }})
      .then((response) => response.data)
      .catch((err) => err);

    setExtracts([...cashOutExtracts, ...cashInExtracts])
  };

  const generateExtractCashIn = async () => {
    setCashOut([]);
    setExtracts([]);
    setSortExtracts([]);

    await axios.get(getCashInURL, { headers: { Authorization }})
      .then((response) => {
        setCashIn(response.data);
      })
      .catch((err) => err);
  };

  const generateExtractCashOut = async () => {
    setCashIn([]);
    setExtracts([]);
    setSortExtracts([]);

    await axios.get(getCashOutURL, { headers: { Authorization }})
      .then((response) => {
        setCashOut(response.data);
      })
      .catch((err) => err);
  };

  const filterByDateOrder = async () => {
    if (extracts.length > 0) {
      const orderned = extracts.reverse();
      setExtracts([]);
      setSortExtracts(orderned)
    };

    if (cashIns.length > 0) {
      const orderned = cashIns.reverse();
      setCashIn([]);
      setSortExtracts(orderned);
    };

    if (cashOuts.length > 0) {
      const orderned = cashOuts.reverse();
      setCashOut([]);
      setSortExtracts(orderned)
    };

  };

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
          <div className="extracts-container">
            <h1>Relatório de transações IT Ca$h</h1>
            <button id="change-order-btn" onClick={filterByDateOrder}>Ordem decrescente</button>
            <button id="general-extract-btn" onClick={generateExtract}>Extrato geral</button>
            <button id="cashin-extract-btn" onClick={generateExtractCashIn}>Extrato entradas</button>
            <button id="cashout-extract-btn" onClick={generateExtractCashOut}>Extrato saídas</button>
            <table id="cashout-list">
            <thead>
              <tr>
                <th>ID</th>
                <th>Conta debitada</th>
                <th>Conta creditada</th>
                <th>Valor da transação</th>
                <th>Data da transação</th>
              </tr>
            </thead>
            <tbody id="tbody-extract">
            
            {extracts.length >= 0 && extracts.map((extract) => RowGenerate(extract))}
            {cashOuts.length >= 0 && cashOuts.map((extract) => RowGenerate(extract))}
            {cashIns.length >= 0 && cashIns.map((extract) => RowGenerate(extract))}
            {sortExtracts.length >= 0 && sortExtracts.map((extract) => RowGenerate(extract))}
            </tbody>
          </table>
          </div>
          {/* <div className="cashin-container">
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
          </div> */}
      </div>
    </div>
  )
}