import axios from "axios";
import { FormEvent, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { User } from '../schemas/schemas';
import { validateFieldsUser } from '../utils/validateFields';


export default function Login() {
  const navigate = useNavigate();

  const url = 'http://localhost:3001/user/login';

  const [errors, setErrors] = useState<IError>();
  
  const refUsername = useRef<HTMLInputElement>(null);
  const refPassword = useRef<HTMLInputElement>(null);

  const login = async (user: User) => {
    axios.post(url, user)
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem('token', JSON.stringify(response.data));
          navigate('/user/logged');
        }
      })
      .catch((error) => console.log(error.response.data));
  };

  const getValues = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (refPassword.current && refUsername.current) {
      const user: User = {
        username: refUsername.current.value,
        password: refPassword.current.value,
      };

      const hasError = validateFieldsUser(user);

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
        <div className="warp-login">
          <form className="form-login" onSubmit={getValues}>
            {errors && <span className='error-message-register'>{errors.message}</span>}

            <h1 className="form-login-title">Faça o login</h1>

            <div className="wrap-login-input">
              <input
                type="text"
                className= 'input-login'
                id="username"
                name="username"
                placeholder="Digite seu usuário"
                ref={refUsername}
              />
            </div>
            <div className="wrap-login-input">
              <input
                type="password"
                className='input-login'
                id="password"
                name="name"
                placeholder="Digite sua senha"
                ref={refPassword}
              />
            </div>
            <button
              className='login-form-btn'
              type='submit'
            >
              Entrar
            </button>
            <div className="text-nao-possui-conta">
            <span className="text">Não possui conta?</span>
            <a href="/user/register" className="link-register-page">Fazer cadastro.</a>
          </div>
          </form>
        </div>
      </div>
    </div>
  )
}