import { Outlet, Link} from "react-router-dom";

function LayoutAdmin({ children }) {
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-xl">Admin Dashboard</h1>
        <div>
          <Link to="/admin" className="text-white hover:text-gray-300 mr-4">Dashboard</Link>
          <Link to="/admin/usuarios" className="text-white hover:text-gray-300 ml-4">Usuarios</Link>  
          <Link to="/admin/disciplinas" className="text-white hover:text-gray-300">Disciplinas</Link> 
          <Link to="/admin/horarios" className="text-white hover:text-gray-300 ml-4">Horarios</Link>  
          <Link to="/admin/reservas" className="text-white hover:text-gray-300 ml-4">Reservas</Link>  
          <Link to="/admin/cancelaciones" className="text-white hover:text-gray-300 ml-4">Cancelaciones</Link>  
         
        </div>
      </header>
      <main className="flex-1 p-4 bg-gray-100">
        <Outlet />  
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        © 2023 Admin Dashboard
      </footer>
    </div>
  );
}

export default LayoutAdmin;