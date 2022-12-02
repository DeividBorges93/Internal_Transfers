import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import RowGenerate from "../components/RowExtracts";
import '../styles/global.css';
import '../styles/logged.css';

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
  
  const token = localStorage.getItem('token');
  const Authorization = JSON.parse(token || '');

  useEffect(() => {
    axios.get(getBalanceURL, { headers: { Authorization }})
      .then((response) => {
        setBalance(response.data);
      })
      .catch((err) => err);
  }, [Authorization]);

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
          <div className="header-left">
            <span className="actual-balance">{`Saldo atual IT$ ${balance}`}</span>
          </div>
          <div className="header-center">
            <h1 className="transaction-title">Transferência</h1>
            <form className="transaction-form" onSubmit={ getValues }>
              <div className="wrap-transaction-input">
                <input className="input-transaction debited-account-id"
                  type="text"
                  value={username}
                  readOnly
                />
              </div>
              <div className="wrap-transaction-input">
                <input className="input-transaction credited-account-id"
                  type="number"
                  ref={refCreditedId}
                  placeholder="ID que receberá o saldo"
                />
              </div>
              <div className="wrap-transaction-input">
                <input className="input-transaction value-transfer"
                  type="number"
                  ref={refValueTransfer}
                  placeholder="Valor da transferência"
                />
              </div>
              <button className="send-tranfer-btn"
                type="submit"
              >
                Transferir
              </button>
            </form>
          </div>
          <div className="header-right">
            <div className="actual-username">
              <span className="username">{`Logado com ${username}`}</span>
            </div>
            <button className="logout-btn" onClick={ logout }>Sair</button>
          </div>
        </header>
        <div className="extracts-container">
          <h1 className="extract-title">Relatório de transações IT Ca$h</h1>
            <div className="extract-btn">
              <button id="change-order-btn" onClick={filterByDateOrder}>Ordem crescente</button>
              <button id="general-extract-btn" onClick={generateExtract}>Extrato geral</button>
              <button id="cashin-extract-btn" onClick={generateExtractCashIn}>Extrato entradas</button>
              <button id="cashout-extract-btn" onClick={generateExtractCashOut}>Extrato saídas</button>
            </div>
          <div className="table-extracts">
            <table id="extract-list">
            <thead>
              <tr>
                <th>ID</th>
                <th>Conta debitada</th>
                <th>Conta creditada</th>
                <th>Valor da transação</th>
                <th>Data</th>
                <th>Hora</th>

              </tr>
            </thead>
            <tbody id="tbody-extract">
            
            {extracts.length >= 0 && extracts.map((extract) => RowGenerate(extract))}
            {cashOuts.length >= 0 && cashOuts.map((cashout) => RowGenerate(cashout))}
            {cashIns.length >= 0 && cashIns.map((cashin) => RowGenerate(cashin))}
            {sortExtracts.length >= 0 && sortExtracts.map((sortExtract) => RowGenerate(sortExtract))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  )
}