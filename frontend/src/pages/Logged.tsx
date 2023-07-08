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

  const [extracts, setExtracts] = useState<Transaction[]>([]);

  const [user, setUser] = useState<UserAllFields>();
  const [btnName, setBtnName] = useState<string>('decrescente');

  const getUserInfoURL = 'http://localhost:3001/user/info';
  const sendTransferURL = 'http://localhost:3001/transaction';

  const token = localStorage.getItem('token');
  const Authorization = JSON.parse(token || '');

  useEffect(() => {
    axios.get(getUserInfoURL, { headers: { Authorization }})
    .then((response) => {
      setUser(response.data);
    })
    .catch((err) => console.log(err)
    );
  }, []);

  const changeOrder = async (extracts: Transaction[]) => {
    if (btnName === 'crescente') {
      const sortedExtracts = extracts.sort((item1, item2) => {
        if (item1.createdAt > item2.createdAt) {
          return 1;
        }
  
        if (item1.createdAt < item2.createdAt) {
          return -1;
        }
  
        return 0;
      });
      setBtnName('decrescente');
      return sortedExtracts;
    } else {
      const sortedExtracts = extracts.sort((item1, item2) => {
        if (item1.createdAt > item2.createdAt) {
          return -1;
        }
  
        if (item1.createdAt < item2.createdAt) {
          return 1;
        }
  
        return 0;
      });
      setBtnName('crescente');
      return sortedExtracts;
    }
  }
  
  const generateExtract = async () => {
    if (user) {
      const {debitedTransactions, creditedTransactions} = user.account;
      
      const extracts = ([...debitedTransactions, ...creditedTransactions]);
      
      const sortedExtracts = extracts.sort((item1, item2) => {
        if (item1.createdAt > item2.createdAt) {
          return 1;
        }
  
        if (item1.createdAt < item2.createdAt) {
          return -1;
        }
  
        return 0;
      });
      
      setExtracts(sortedExtracts);
    }
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

  const checkValues = async () => {
    const submitBtn = document.getElementById('send-transfer-btn') as HTMLButtonElement;

    submitBtn.disabled = false
  }

  return (
    <div className="container">
      <div className="container-logged">
        <header className="header-logged">
          <div className="header-left">
            <div className="wrap-balance">
              <span className="actual-balance">{`Saldo atual IT$ ${user?.account.balance},00`}</span>
            </div>
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
                  id="credit-id"
                  type="number"
                  ref={refCreditedId}
                  onChange={checkValues}
                  placeholder="ID que receberá o saldo"
                />
              </div>
              <div className="wrap-transaction-input">
                <input className="input-transaction value-transfer"
                  id="value"
                  type="number"
                  ref={refValueTransfer}
                  onChange={checkValues}
                  placeholder="Valor da transferência"
                />
              </div>
              <div className="wrap-transaction-btn">
                <button
                  id="send-transfer-btn"
                  type="submit"
                  disabled
                >
                  Transferir
                </button>
              </div>
            </form>
          </div>
          <div className="header-right">
            <div className="wrap-actual-username">
              <span className="username">{`Logado com ${user?.username}`}</span>
            </div>
            <div className="wrap-logout-btn">
              <button className="logout-btn" onClick={ logout } >
              </button>
            </div>
          </div>
        </header>
        <div className="extracts-container">
          <div className="extracts-wrap">
            <div className="extract-title-container">
              <h1 className="extract-title">Relatório de transações IT Ca$h</h1>
            </div>
              <div className="extract-btns">
                <button id="change-order-btn"  className={btnName} onClick={() => changeOrder(extracts)} />
                <button id="generate-extract-btn" onClick={generateExtract}>Gerar extrato</button>
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
              {extracts.length >= 0 && extracts.map((extract: Transaction) => <RowGenerate extract={extract} username={user?.username} />)}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}