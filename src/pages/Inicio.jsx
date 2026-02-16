import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardAdmin from '../components/dashboardAdmin';
import DashboardContador from '../components/dashboardContador';


export default function VistaInicio() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    fetchUsuario();
  }, []);

  // Obtener información del usuario logueado
  const fetchUsuario = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Si no hay token, redirigir al login
        navigate('/login');
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        // Si el token es inválido, redirigir al login
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      const data = await response.json();
      setUsuario(data.usuario);
    } catch (err) {
      console.error('Error al cargar usuario:', err);
      // Por ahora, en desarrollo, creamos un usuario mock
      setUsuario({
        nombre: 'Usuario',
        apellido: 'Demo',
        email: 'demo@empresa.cl',
        rol: 'contador', // Cambia a 'admin' para probar el dashboard de admin
        empresa: { nombre: 'Estudio Contable Demo' }
      });
    } finally {
      setLoading(false);
    }
  };

  // Mostrar spinner mientras carga
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

  // Si no hay usuario (no debería llegar aquí, pero por seguridad)
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

  // Renderizar dashboard según el rol (sin navbar porque ya tienes Sidebar)
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