import axios from "axios";
import React, { FormEvent, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { User } from '../schemas/schemas';
import { validateFieldsUser } from '../utils/validateFields';
import '../styles/global.css';
import '../styles/register.css';

export default function Register() {
  const navigate = useNavigate();

  const url = 'http://localhost:3001/user/register';

  const [errors, setErrors] = useState<IError>();

  const refUsername = useRef<HTMLInputElement>(null);
  const refPassword = useRef<HTMLInputElement>(null);

  const checkValues = async () => {
    const submitBtn = document.getElementById('register-form-btn') as HTMLButtonElement;
    const inputUsername = document.getElementById('username') as HTMLInputElement;
    const inputPassword = document.getElementById('password') as HTMLInputElement;

    const { value: username } = inputUsername;
    const { value: password } = inputPassword;    

    password.length >= 8 && username.length >= 3 &&
    password !== null && username !== null &&
    password !== '' && username !== '' ? submitBtn.disabled = false : submitBtn.disabled = true;
  }

  const createUser = async (data: User) => {
    axios.post(url, data)
    .then((response) => {
      if (response.status === 201) {
        localStorage.setItem('username', JSON.stringify(data.username));
        navigate('/user/login');
        console.log('cadastrado com sucesso');
      };
    })
    .catch((err) => setErrors({ code: 401, message: err.response.data })
    );
  };

  const addUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (refPassword.current && refUsername.current) {
      const data: User = {
        username: refUsername.current.value,
        password: refPassword.current.value,
      };
      
      const hasError = validateFieldsUser(data);

      if (hasError) {
        setErrors(hasError);
      }

      createUser(data);
    };
  };

  return (
    <div className="container">
      <div className="container-register">
        <div className="wrap-register">
          <form className="form-register" onSubmit={ addUser }>
            {errors && <span className='error-message-register'>{errors.message}</span>}
            <h1 className='form-register-title'>Cadastre-se</h1>
            <div className="wrap-register-input">
              <input
                type="text"
                className='register-input'
                id="username"
                name="name"
                onChange={checkValues}
                placeholder="Digite seu usuário"
                ref={refUsername}
              />
            </div>
            <div className="wrap-register-input">
              <input
                type="password"
                className='register-input'
                id="password"
                name="name"
                onChange={() => checkValues()}
                placeholder="Digite sua senha"
                ref={refPassword}
              />
            </div>
            <div className='container-register-form-btn'>
              <button
                id='register-form-btn'
                type='submit'
              >
                Finalizar
              </button>
            </div>
            <div className="text-ja-possui-conta">
              <span className="text-register">Já possui conta?</span>
              <div className="container-link-login">
                <a href="/user/login" className="link-login-page">Fazer login.</a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}