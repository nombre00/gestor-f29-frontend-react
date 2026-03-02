// Dashboard del admin para manejar el sistema: gestionar usuarios, gestionar clientes y dashboard contador. 


// Bibliotecas.
import { useState } from 'react';
// Contexto.
import { useAuth } from '../../context/AuthContext';
// Módulos.
import AdministrarUsuarios from './administrarUsuarios';
import AdministrarClientes from './administrarClientes';
import DashboardContador from '../dashboardContador/dashboardContador';



export default function DashboardAdmin() {
  const [tabActiva, setTabActiva] = useState('usuarios');
  const { user } = useAuth();  // Usuario logueado desde el contexto.

  return (
    <div className="min-vh-100 bg-light">
      {/* Header del Dashboard */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">
            <i className="bi bi-graph-up-arrow me-2"></i>
            F29 Manager
          </span>
          <div className="d-flex align-items-center text-white">
            <span className="me-3">
              <i className="bi bi-building me-1"></i>
              {user?.empresa || ''}
            </span>
            <span className="me-3">
              <i className="bi bi-person-circle me-1"></i>
              {user?.nombre || ''}
            </span>
            <button className="btn btn-outline-light btn-sm">
              <i className="bi bi-box-arrow-right me-1"></i>
              Salir
            </button>
          </div>
        </div>
      </nav>
      {/* Pestañas de navegación */}
      <div className="bg-white shadow-sm">
        <div className="container-fluid">
          <ul className="nav nav-tabs border-0 pt-3">
            <li className="nav-item">
              <button
                className={`nav-link ${tabActiva === 'usuarios' ? 'active' : ''}`}
                onClick={() => setTabActiva('usuarios')}
              >
                <i className="bi bi-people-fill me-2"></i>
                Usuarios
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${tabActiva === 'clientes' ? 'active' : ''}`}
                onClick={() => setTabActiva('clientes')}
              >
                <i className="bi bi-briefcase-fill me-2"></i>
                Clientes
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${tabActiva === 'f29' ? 'active' : ''}`}
                onClick={() => setTabActiva('f29')}
              >
                <i className="bi bi-file-earmark-text-fill me-2"></i>
                F29
              </button>
            </li>
          </ul>
        </div>
      </div>
      {/* Contenido de las pestañas */}
      <div className="container-fluid">
        {tabActiva === 'usuarios'  && <AdministrarUsuarios />}
        {tabActiva === 'clientes'  && <AdministrarClientes />}
        {tabActiva === 'f29'       && <DashboardContador usuario={user} />}
      </div>
    </div>
  );
}