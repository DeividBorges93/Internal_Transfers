import axios from "axios";
import { FormEvent, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { User } from '../schemas/schemas';
import { validateFieldsLoginUser } from '../utils/validateFields';
import '../styles/global.css';
import '../styles/login.css';


export default function Login() {
  const navigate = useNavigate();

  const url = 'http://localhost:3001/user/login';

  const [errors, setErrors] = useState<IError>();
  
  const refUsername = useRef<HTMLInputElement>(null);
  const refPassword = useRef<HTMLInputElement>(null);

  const checkValues = async () => {
    const submitBtn = document.getElementById('login-form-btn') as HTMLButtonElement;
    const inputUsername = document.getElementById('username') as HTMLInputElement;
    const inputPassword = document.getElementById('password') as HTMLInputElement;

    const { value: username } = inputUsername;
    const { value: password } = inputPassword;    

    password.length >= 8 && username.length >= 3 &&
    password !== null && username !== null &&
    password !== '' && username !== '' ? submitBtn.disabled = false : submitBtn.disabled = true;
  }

  const login = async (user: User) => {
    await axios.post(url, user)
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem('token', JSON.stringify(response.data));
          navigate('/user/logged');
        };
      })
      .catch((err) => setErrors({ code: 401, message: err.response.data })
      );
  };

  const getValues = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (refPassword.current && refUsername.current) {
      const user: User = {
        username: refUsername.current.value,
        password: refPassword.current.value,
      };

      const hasError = validateFieldsLoginUser(user);

      if (hasError) {
        setErrors(hasError);
      };
      localStorage.setItem('username', JSON.stringify(refUsername.current.value));
      login(user);
    };
  };
  
  return (
    <div className="container">
      <div className="container-login">
        <div className="wrap-login">
          <form className="form-login" onSubmit={getValues}>
            {errors && <span className='error-message-login'>{errors.message}</span>}

            <h1 className="form-login-title">Fazer o login</h1>
            <div className="wrap-login-input">
              <input
                type="text"
                className= 'login-input'
                id="username"
                name="username"
                onChange={checkValues}
                placeholder="Digite seu usuário"
                ref={refUsername}
              />
            </div>
            <div className="wrap-login-input">
              <input
                type="password"
                className='login-input'
                id="password"
                name="name"
                onChange={checkValues}
                placeholder="Digite sua senha"
                ref={refPassword}
              />
            </div>
            <div className="container-login-form-btn">
            <button
              id='login-form-btn'
              type='submit'
            >
              Entrar
            </button>
            </div>
            <div className="text-nao-possui-conta">
              <span className="text-login">Não possui conta?</span>
              <div className="container-link-register">
                <a href="/user/register" className="link-register-page">Cadastre-se.</a>
              </div>
          </div>
          </form>
        </div>
      </div>
    </div>
  )
}