import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';  // ← importa el contexto

export default function Sidebar() {
  const { logout } = useAuth();           // ← extrae la función logout del contexto
  const navigate = useNavigate();         // ← para redirigir después del logout

  const handleLogout = () => {
    logout();                             // Limpia contexto + localStorage ('token' y 'user')
    navigate('/login');                   // Redirige al login
    // Opcional: mostrar mensaje (puedes cambiar por toast más adelante)
    // alert('Sesión cerrada correctamente');
  };

  return (
    <div 
      className="d-flex flex-column flex-shrink-0 p-3 bg-primary text-white vh-100 position-fixed"
      style={{ width: '250px', top: 0, left: 0, overflowY: 'auto' }}
    >
      <a 
        href="/inicio" 
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
      >
        <i className="bi bi-file-earmark-text-fill fs-4 me-2"></i>
        <span className="fs-4">Gestor F29</span>
      </a>

      <hr className="text-white" />

      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink 
            to="/inicio"
            className={({ isActive }) => `nav-link text-white ${isActive ? 'active bg-white text-primary' : ''}`}
          >
            <i className="bi bi-house-door-fill me-2"></i>
            Dashboard
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink 
            to="/gestor"
            className={({ isActive }) => `nav-link text-white ${isActive ? 'active bg-white text-primary' : ''}`}
          >
            <i className="bi bi-file-earmark-plus me-2"></i>
            Generar F29
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink 
            to="/resumen-anual"
            className={({ isActive }) => `nav-link text-white ${isActive ? 'active bg-white text-primary' : ''}`}
          >
            <i className="bi bi-graph-up-arrow me-2"></i>
            Resumen Anual
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink 
            to="/registrar-empresa" 
            className={({ isActive }) => `nav-link text-white ${isActive ? 'active bg-white text-primary' : ''}`}
          >
            <i className="bi bi-building-add me-2"></i>  {/* Cambié icono a uno más adecuado */}
            Registrar empresa
          </NavLink>
        </li>
      </ul>

      <hr className="text-white" />

      <div className="mt-auto">
        <div className="dropdown">
          <button 
            className="btn btn-link text-white dropdown-toggle text-decoration-none w-100 text-start"
            type="button"
            data-bs-toggle="dropdown"
          >
            <i className="bi bi-person-circle me-2"></i>
            Cuenta
          </button>
          <ul className="dropdown-menu dropdown-menu-dark">
            <li>
              <button 
                className="dropdown-item"
                onClick={handleLogout}  // ← llama a la función real
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}