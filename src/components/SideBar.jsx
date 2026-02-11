// Componente que enruta, va en las páginas: inicio, gestorf29, gestorresumenanual, registrarempresa

import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  return (
    <div 
      className="d-flex flex-column flex-shrink-0 p-3 bg-primary text-white vh-100 position-fixed"
      style={{ width: '250px', top: 0, left: 0, overflowY: 'auto' }}
    > {/* Dimenciones del sidebar. */}
      <a 
        href="/inicio" 
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
      >
        <i className="bi bi-file-earmark-text-fill fs-4 me-2"></i>
        <span className="fs-4">Gestor F29</span>
      </a>

      <hr className="text-white" />

      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">  {/* Botón 1. */}
          <NavLink 
            to="/inicio"
            className={({ isActive }) => `nav-link text-white ${isActive ? 'active bg-white text-primary' : ''}`}
          >  {/* Ruta 1. */}
            <i className="bi bi-house-door-fill me-2"></i>
            Dashboard
          </NavLink>
        </li>

        <li className="nav-item">  {/* Botón 2. */}
          <NavLink 
            to="/gestor"
            className={({ isActive }) => `nav-link text-white ${isActive ? 'active bg-white text-primary' : ''}`}
          >  {/* Ruta 2. */}
            <i className="bi bi-file-earmark-plus me-2"></i>
            Generar F29
          </NavLink>
        </li>

        <li className="nav-item">  {/* Botón 3. */}
          <NavLink 
            to="/resumen-anual"
            className={({ isActive }) => `nav-link text-white ${isActive ? 'active bg-white text-primary' : ''}`}
          >  {/* Ruta 3. */}
            <i className="bi bi-graph-up-arrow me-2"></i>
            Resumen Anual
          </NavLink>
        </li>

        <li className="nav-item">  {/* Botón 4. */}
          <NavLink 
            to="/registrar-empresa" 
            className={({ isActive }) => `nav-link text-white ${isActive ? 'active bg-white text-primary' : ''}`}
          >  {/* Ruta 4. */}
            <i className="bi bi-graph-up-arrow me-2"></i>
            Registar empresa
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
                onClick={() => {
                  // Aquí iría la lógica real de logout más adelante
                  alert('Sesión cerrada')
                  window.location.href = '/login'
                }}
              >
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}