import axios from 'axios';
import React, { useRef } from 'react';
import { Route } from 'react-router-dom';
import Home from '../home/home';


// Definición del componente Funcional
const Login = () => {
  const inputEmail = useRef(null)
  const inputPass = useRef(null)

  const sendLogin = ()=>{
    console.log('EJECUTANTO LOGIN');
    var dataPost = {
      email: inputEmail.current.value,
      password: inputPass.current.value
    }
    console.log(dataPost);
    axios.post('http://localhost:4000/api/login',dataPost).then(resp =>{
      var objToken = resp.data
      localStorage.setItem('login', true)
      localStorage.setItem('token', objToken.token)
      console.log(objToken);
      window.location.replace('/')
    }).catch(error =>{
      alert('Ocurrio un Problema')
    })
  }
  return (
    <div className='d-flex justify-content-center align-items-center mt-3'>
      <div className='d-grid justify-content-center'>
        <h1 className='text-center'>LOGIN</h1>
        <div className="mb-3">
          <label htmlFor="inputEmail" className="form-label">Usuario</label>
          <input type="email" className="form-control" value={"demorh@weship.com"} id="inputEmail" placeholder="Correo"  ref={inputEmail}/>
        </div>
        <div className="mb-3">
          <label htmlFor="inputPassword" className="form-label">Contraseña</label>
          <input type="password" className="form-control" value={"D3m0Rh.!"} id="inputPassword" placeholder="Contraseña" ref={inputPass}/>
        </div>
        <div className="mb-3 d-flex justify-content-center">
          <button onClick={ sendLogin } className='btn btn-primary'>Iniciar Sesión</button>
        </div>
      </div>
    </div>
  );
};

export default Login;