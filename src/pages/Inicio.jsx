//  Página inicio.


// Página inicio.
// Lee el usuario directo del AuthContext — no hace fetch propio.
// El AuthContext ya recupera token y user del localStorage al montar.

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardAdmin    from '../components/dashboardAdmin/dashboardAdmin';
import DashboardContador from '../components/dashboardContador/dashboardContador';


export default function VistaInicio() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;          // Espera a que AuthContext lea el localStorage.
    if (!isAuthenticated) navigate('/login');
  }, [isLoading, isAuthenticated, navigate]);

  // Mientras AuthContext lee el localStorage, muestra spinner.
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario tras cargar, el useEffect ya redirigió — no renderizar nada.
  if (!user) return null;

  return (
    <div className="bg-light min-vh-100">
      {user.rol === 'admin'    && <DashboardAdmin    usuario={user} />}
      {user.rol === 'contador' && <DashboardContador usuario={user} />}
      {user.rol === 'asistente' && (
        <div className="container py-5 text-center">
          <div className="alert alert-info">
            <i className="bi bi-info-circle-fill me-2"></i>
            Dashboard de asistente en desarrollo
          </div>
        </div>
      )}
    </div>
  );
}