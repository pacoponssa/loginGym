import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';


function App() {
  const [isLoginView, setIsLoginView] = useState(true);

  const switchToRegister = () => {
    setIsLoginView(false);
  };

  const switchToLogin = () => {
    setIsLoginView(true);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="bg-gradient-to-b from-violet-50 to-gray-100 min-h-screen">
          {isLoginView ? (
            <Login onSwitchToRegister={switchToRegister} />
          ) : (
            <Register onSwitchToLogin={switchToLogin} />
          )}
          <div>
            <h1>Registro de Usuario</h1>
            <Register/>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;