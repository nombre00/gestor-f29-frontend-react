import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardAdmin from '../components/dashboardAdmin';
import DashboardContador from '../components/dashboardContador';
import api from '../api/api';

export default function VistaInicio() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsuario();
  }, []);

  // Esta función revisa el token del ususario.
  const fetchUsuario = async () => {
    try {
      const token = localStorage.getItem('token');
      //console.log('[Inicio] Token encontrado:', !!token, token?.substring(0, 20) + '...'); // ver si hay token
      if (!token) {
        //console.log('[Inicio] No hay token → redirigiendo a login')
        navigate('/login');
        return;
      }
      // Usamos api.get → el interceptor ya agrega el Bearer token automáticamente
      //console.log('[Inicio] Intentando GET /auth/me');
      const response = await api.get('/auth/me');
      //console.log('[Inicio] Respuesta OK:', response.status);
      //console.log('[Inicio] Datos recibidos:', response.data);
      // La respuesta del backend /me devuelve directamente el objeto usuario
      // (no envuelto en { usuario: ... }), según lo que configuramos
      setUsuario(response.data);
    } catch (err) {
      //console.error('Error al cargar usuario:', err);
      // Opcional: mostrar mensaje más claro según el tipo de error
      if (err.response?.status === 401 || err.response?.status === 403) {
        //console.log('Token inválido o usuario inactivo → cerrando sesión');
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };
  {/** Spiner. */}
  if (loading) {
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
  {/** contenido si no hay usuario. */}
  if (!usuario) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Error al cargar información del usuario
        </div>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => navigate('/login')}
        >
          Volver al Login
        </button>
      </div>
    );
  }
  {/** La página cuando todo marcha bien. */}
  return (
    <div className="bg-light min-vh-100">
      {usuario.rol === 'admin' && <DashboardAdmin usuario={usuario} />}
      {usuario.rol === 'contador' && <DashboardContador usuario={usuario} />}
      {usuario.rol === 'asistente' && (
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