// Envoltorio de seguridad, evita que se ingrese escribiendo la URL en el navegador si no se tiene el token de ingreso.

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute() {
  const { isAuthenticated } = useAuth();

  // Si no está autenticado → redirige a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado → renderiza el layout y las rutas hijas
  return <Outlet />;
}