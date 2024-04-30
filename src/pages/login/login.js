import axios from 'axios';
import React, { useState } from 'react';


const Login = () => {
  const [email, setEmail] = useState('demorh@weship.com');
  const [password, setPassword] = useState('D3m0Rh.!');

  const sendLogin = ()=>{
    var dataPost = {
      email: email,
      password: password
    }
    axios.post('http://localhost:4000/api/login',dataPost).then(resp =>{
      var objToken = resp.data
      console.log(objToken);
      if (!objToken.success || objToken.success === 'invalid_credentials') {
        alert(objToken.token)
        localStorage.clear()
        return 0
      }
      localStorage.setItem('login', objToken.success)
      localStorage.setItem('token', objToken.token)
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
          <input type="email" className="form-control" value={email} id="inputEmail" placeholder="Correo"  onChange={(e)=> setEmail(e.target.value)}/>
        </div>
        <div className="mb-3">
          <label htmlFor="inputPassword" className="form-label">Contraseña</label>
          <input type="password" className="form-control" value={password} id="inputPassword" placeholder="Contraseña" onChanges={(e)=> setPassword(e.target.value)}/>
        </div>
        <div className="mb-3 d-flex justify-content-center">
          <button onClick={ sendLogin } className='btn btn-primary'>Iniciar Sesión</button>
        </div>
      </div>
    </div>
  );
};

export default Login;