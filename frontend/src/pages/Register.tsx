import axios from "axios";
import React, { FormEvent, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { User } from '../schemas/schemas';
import { validateFieldsUser } from '../utils/validateFields';
import logoPage from '../assets/logoPage.png';
import '../styles/register.css';

export default function Register() {
  const navigate = useNavigate();

  const url = 'http://localhost:3001/user/register';

  // const [username, setUsername] = useState('');
  // const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<IError>();


  const refUsername = useRef<HTMLInputElement>(null);
  const refPassword = useRef<HTMLInputElement>(null);

  const createUser = async (data: User) => {
    axios.post(url, data)
    .then((response) => {
      if (response.status === 201) {
        localStorage.setItem('username', JSON.stringify(data.username));
        navigate('/user/login');
        console.log('cadastrado com sucesso');
      };
    })
    .catch((err) => err);
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
            <h1 className='form-register-title'>Cadastro de usuário</h1>
            <div className="image-logo">
              <img src={logoPage} alt="logo da paǵina"/>
            </div>
            <div className="wrap-register-input">
              <input
                type="text"
                className='register-input'
                id="username"
                name="name"
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
                placeholder="Digite sua senha"
                ref={refPassword}
              />
            </div>
            <div className='container-register-form-btn'>
              <button
                className='register-form-btn'
                type='submit'
              >
                Finalizar
              </button>
            </div>
            <div className="text-ja-possui-conta">
              <span className="text">Já possui conta?</span>
              <a href="/user/login" className="link-login-page">Fazer login.</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}