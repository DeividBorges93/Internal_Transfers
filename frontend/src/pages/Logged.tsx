import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import RowGenerate from "../components/RowExtracts";
import '../styles/global.css';
import '../styles/logged.css';

export default function Logged() {
  const navigate = useNavigate();

  const refCreditedId = useRef<HTMLInputElement>(null);
  const refValueTransfer = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<UserAllFields>();
  const [extracts, setExtracts] = useState<Transaction[]>([]);

  const [cashOuts, setCashOut] = useState<Transaction[]>([]);
  const [cashIns, setCashIn] = useState<Transaction[]>([]);
  const [sortExtracts, setSortExtracts] = useState<Transaction[]>([]);

  // const [formatedDate, setFormatedDate] = useState<string>();

  const getUserInfoURL = 'http://localhost:3001/user/info';
  const getTransactionsURL = 'http://localhost:3001/transactions/';
  // const getCashOutURL = 'http://localhost:3001/transactions/debited';
  // const getCashInURL = 'http://localhost:3001/transactions/credited';
  const sendTransferURL = 'http://localhost:3001/transaction';
  
  const token = localStorage.getItem('token');
  const Authorization = JSON.parse(token || '');

  useEffect(() => {
    axios.get(getUserInfoURL, { headers: { Authorization }})
      .then((response) => {
        setUser(response.data);
      })
      .catch((err) => err);
  }, []);


  const generateExtract = async () => {
    if (!user) return;

    const {creditedTransactions, debitedTransactions} = user.account;

    setCashIn(creditedTransactions);
    setCashOut(debitedTransactions);

    setExtracts([...cashIns, ...cashOuts]);
  };

  const logout = async () => {
    navigate('/user/login');
    localStorage.setItem('token', JSON.stringify(''));
    localStorage.setItem('username', JSON.stringify(''));
  };

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


  return (
    <div className="container">
      <div className="container-logged">
        <header className="header-logged">
          <div className="header-left">
            <span className="actual-balance">{`Saldo atual IT$ ${user?.account.balance}`}</span>
          </div>
          <div className="header-center">
            <h1 className="transaction-title">Transferência</h1>
            <form className="transaction-form" onSubmit={ getValues }>
              <div className="wrap-transaction-input">
                <input className="input-transaction debited-account-id"
                  type="text"
                  value={user?.username}
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
              <span className="username">{`Logado com ${user?.username}`}</span>
            </div>
            <div className="container-logout-btn">
              <button className="logout-btn" onClick={ logout }>Sair</button>
            </div>
          </div>
        </header>
        <div className="extracts-container">
          <h1 className="extract-title">Relatório de transações IT Ca$h</h1>
            <div className="extract-btn">
              {/* <button id="change-order-btn" onClick={filterByDateOrder}>Ordem crescente</button> */}
              <button id="general-extract-btn" onClick={generateExtract}>Extrato geral</button>
              {/* <button id="cashin-extract-btn" onClick={generateExtractCashIn}>Extrato entradas</button>
              <button id="cashout-extract-btn" onClick={generateExtractCashOut}>Extrato saídas</button> */}
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
            {extracts.length >= 0 && extracts.map((extract) => RowGenerate(extract, user?.username))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  )
}