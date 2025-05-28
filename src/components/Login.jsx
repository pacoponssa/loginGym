import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, token } = useContext(AuthContext);
 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/protected');
    } catch (error) {
      console.error('Error de autenticación:', error);
    }
  };

  useEffect(() => { 
    console.log("token", token)
    if (token) {
      navigate('/protected');
    }
  }, [token, navigate ]);

  return (
    <form className='' onSubmit={handleLogin}>
      <input type="text" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Iniciar sesión</button>
    </form>
  );
};

export default Login;
