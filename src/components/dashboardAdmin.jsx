// Dashboard del admin para manejar el sistema: gestionar usuarios. 


// Bibliotecas.
import { useState } from 'react';
// Módulos.
import AdministrarUsuarios from './administrarUsuarios';

export default function DashboardAdmin() {
  const [tabActiva, setTabActiva] = useState('usuarios');

  // Datos del usuario logueado (normalmente vendrían del contexto/auth)
  const usuario = {
    nombre: 'Admin',
    rol: 'admin',
    empresa: 'Estudio Contable ABC'
  };

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
              {usuario.empresa}
            </span>
            <span className="me-3">
              <i className="bi bi-person-circle me-1"></i>
              {usuario.nombre}
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
                disabled
              >
                <i className="bi bi-briefcase-fill me-2"></i>
                Clientes
                <span className="badge bg-secondary ms-2">Próximamente</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${tabActiva === 'resumenes' ? 'active' : ''}`}
                onClick={() => setTabActiva('resumenes')}
                disabled
              >
                <i className="bi bi-file-earmark-text-fill me-2"></i>
                Resúmenes
                <span className="badge bg-secondary ms-2">Próximamente</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${tabActiva === 'reportes' ? 'active' : ''}`}
                onClick={() => setTabActiva('reportes')}
                disabled
              >
                <i className="bi bi-bar-chart-fill me-2"></i>
                Reportes
                <span className="badge bg-secondary ms-2">Próximamente</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      {/* Contenido de las pestañas */}
      <div className="container-fluid">
        {tabActiva === 'usuarios' && <AdministrarUsuarios />}
        {tabActiva === 'clientes' && (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-briefcase fs-1"></i>
            <p className="mt-3">Gestión de clientes - Próximamente</p>
          </div>
        )}
        {tabActiva === 'resumenes' && (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-file-earmark-text fs-1"></i>
            <p className="mt-3">Visualización de resúmenes - Próximamente</p>
          </div>
        )}
        {tabActiva === 'reportes' && (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-bar-chart fs-1"></i>
            <p className="mt-3">Reportes y estadísticas - Próximamente</p>
          </div>
        )}
      </div>
    </div>
  );
}