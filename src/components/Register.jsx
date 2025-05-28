import React, { useState, useContext, useEffect} from "react";
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(username, password, telefono, email);
      navigate('/login');
    } catch (error) {
      console.error('Error de registro:', error);
    }
  };

return (
  <form onSubmit={handleRegister}>
      <input type="text" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="telefono" placeholder="Telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
      <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Registrarse</button>
    </form>
)
};

export default Register;