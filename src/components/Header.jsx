import React from "react";
import logo from "../assets/logo.png"; // Asegurate de tener el logo aquí

const Header = () => (
  <header className="bg-red-600 text-white flex items-center justify-between px-6 py-3 shadow">
    <div className="flex items-center gap-4">
      <img src={logo} alt="Logo" className="h-10" />
      <h1 className="text-xl font-bold">Panel de Administración</h1>
    </div>
  </header>
);

export default Header;
