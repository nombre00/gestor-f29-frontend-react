// Ventana del dashboard para administrar usuarios.


// Componente para gestionar usuarios de la empresa (invitar, listar, desactivar)

import { useState, useEffect } from 'react';
import ModalInvitarUsuario from './modalInvitarUsuario';
import { 
  obtenerUsuarios, 
  desactivarUsuario, 
  reactivarUsuario 
} from '../services/usuariosService';
import { 
  obtenerInvitacionesPendientes,
  reenviarInvitacion,
  cancelarInvitacion
} from '../services/invitacionesService';

export default function AdministrarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [invitaciones, setInvitaciones] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsuarios();
    fetchInvitaciones();
  }, []);

  // Obtener lista de usuarios activos
  const fetchUsuarios = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await obtenerUsuarios();
      setUsuarios(data.usuarios || []);
    } catch (err) {
      setError(err.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  // Obtener lista de invitaciones pendientes
  const fetchInvitaciones = async () => {
    try {
      const data = await obtenerInvitacionesPendientes();
      setInvitaciones(data.invitaciones || []);
    } catch (err) {
      console.log('Invitaciones no disponibles:', err.message);
      setInvitaciones([]);
    }
  };

  // Desactivar usuario
  const handleDesactivar = async (usuarioId) => {
    if (!confirm('¿Estás seguro de desactivar este usuario?')) return;
    
    setLoading(true);
    try {
      await desactivarUsuario(usuarioId);
      alert('Usuario desactivado correctamente');
      fetchUsuarios();
    } catch (err) {
      alert(err.message || 'Error al desactivar usuario');
    } finally {
      setLoading(false);
    }
  };

  // Reactivar usuario
  const handleReactivar = async (usuarioId) => {
    setLoading(true);
    try {
      await reactivarUsuario(usuarioId);
      alert('Usuario reactivado correctamente');
      fetchUsuarios();
    } catch (err) {
      alert(err.message || 'Error al reactivar usuario');
    } finally {
      setLoading(false);
    }
  };

  // Reenviar invitación
  const handleReenviarInvitacion = async (invitacionId) => {
    setLoading(true);
    try {
      await reenviarInvitacion(invitacionId);
      alert('Invitación reenviada correctamente');
      fetchInvitaciones();
    } catch (err) {
      alert(err.message || 'Error al reenviar invitación');
    } finally {
      setLoading(false);
    }
  };

  // Cancelar invitación
  const handleCancelarInvitacion = async (invitacionId) => {
    if (!confirm('¿Estás seguro de cancelar esta invitación?')) return;
    
    setLoading(true);
    try {
      await cancelarInvitacion(invitacionId);
      alert('Invitación cancelada');
      fetchInvitaciones();
    } catch (err) {
      alert(err.message || 'Error al cancelar invitación');
    } finally {
      setLoading(false);
    }
  };

  // Callback cuando se envía invitación exitosamente
  const handleInvitacionEnviada = () => {
    setShowInviteModal(false);
    fetchInvitaciones();
  };

  // Función helper para formatear fecha
  const formatearFecha = (timestamp) => {
    if (!timestamp) return '-';
    const fecha = new Date(timestamp);
    return fecha.toLocaleDateString('es-CL', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  // Badge de rol con colores
  const BadgeRol = ({ rol }) => {
    const colores = {
      admin: 'bg-danger',
      contador: 'bg-primary',
      asistente: 'bg-secondary'
    };
    
    const labels = {
      admin: 'Administrador',
      contador: 'Contador',
      asistente: 'Asistente'
    };
    
    return (
      <span className={`badge ${colores[rol] || 'bg-secondary'} ms-2`}>
        {labels[rol] || rol}
      </span>
    );
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary mb-0">
          <i className="bi bi-people-fill me-2"></i>
          Gestión de Usuarios
        </h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowInviteModal(true)}
          disabled={loading}
        >
          <i className="bi bi-person-plus-fill me-2"></i>
          Invitar Usuario
        </button>
      </div>
      {/* Mensaje de error global */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError('')}
          ></button>
        </div>
      )}
      {/* Sección: Usuarios Activos */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">
            <i className="bi bi-check-circle-fill me-2"></i>
            Usuarios Activos ({usuarios.filter(u => u.activo).length})
          </h5>
        </div>
        <div className="card-body p-0">
          {loading && usuarios.length === 0 ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : usuarios.filter(u => u.activo).length === 0 ? ( // Cuando no hay usuarios activos.
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox fs-1"></i>
              <p className="mt-3">No hay usuarios activos</p>
            </div>
          ) : (
            // tabla de usuarios activos.
            <div className="table-responsive"> {/** para hacer la tabla responsiba en mobile */}
              {/** tabla */}
              <table className="table table-hover mb-0">
                {/** header de la tabla */}
                <thead className="table-light">
                  {/** contenido del header. */}
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Último Acceso</th>
                    <th>Registrado</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                {/** Cuerpo de la tabla. */}
                <tbody>
                  {usuarios.filter(u => u.activo).map((usuario) => (  // Iretación de los usuarios activos de la empresa.
                    <tr key={usuario.id}>
                      <td>
                        {/** nombre completo */}
                        <i className="bi bi-person-circle me-2 text-primary"></i>
                        {usuario.nombre} {usuario.apellido || ''}
                      </td>
                      {/** mail */}
                      <td>{usuario.email}</td>
                      <td>
                        {/** rol */}
                        <BadgeRol rol={usuario.rol} />
                      </td>
                      <td>{formatearFecha(usuario.ultimo_acceso)}</td>
                      <td>{formatearFecha(usuario.created_at)}</td>
                      <td className="text-center">
                        {/** botón para desactivar al usuario */}
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDesactivar(usuario.id)}
                          disabled={loading}
                        >
                          <i className="bi bi-x-circle me-1"></i>
                          Desactivar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {/* Sección: Usuarios Inactivos */}
      {usuarios.filter(u => !u.activo).length > 0 && (
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-secondary text-white">
            <h5 className="mb-0">
              <i className="bi bi-dash-circle-fill me-2"></i>
              Usuarios Inactivos ({usuarios.filter(u => !u.activo).length})
            </h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Desactivado</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.filter(u => !u.activo).map((usuario) => (
                    <tr key={usuario.id} className="table-secondary">
                      <td className="text-muted">
                        <i className="bi bi-person-circle me-2"></i>
                        {usuario.nombre} {usuario.apellido || ''}
                      </td>
                      <td className="text-muted">{usuario.email}</td>
                      <td>
                        <BadgeRol rol={usuario.rol} />
                      </td>
                      <td className="text-muted">{formatearFecha(usuario.updated_at)}</td>
                      <td className="text-center">
                        <button 
                          className="btn btn-sm btn-outline-success"
                          onClick={() => handleReactivar(usuario.id)}
                          disabled={loading}
                        >
                          <i className="bi bi-check-circle me-1"></i>
                          Reactivar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* Sección: Invitaciones Pendientes */}
      {invitaciones.length > 0 && (
        <div className="card shadow-sm">
          <div className="card-header bg-warning text-dark">
            <h5 className="mb-0">
              <i className="bi bi-envelope-fill me-2"></i>
              Invitaciones Pendientes ({invitaciones.length})
            </h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Invitado</th>
                    <th>Expira</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {invitaciones.map((inv) => (
                    <tr key={inv.id}>
                      <td>
                        <i className="bi bi-envelope me-2 text-warning"></i>
                        {inv.email}
                      </td>
                      <td>
                        <BadgeRol rol={inv.rol} />
                      </td>
                      <td>{formatearFecha(inv.created_at)}</td>
                      <td>{formatearFecha(inv.expires_at)}</td>
                      <td className="text-center">
                        <button 
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleReenviarInvitacion(inv.id)}
                          disabled={loading}
                        >
                          <i className="bi bi-arrow-repeat me-1"></i>
                          Reenviar
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleCancelarInvitacion(inv.id)}
                          disabled={loading}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Cancelar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* Modal de invitación */}
      {showInviteModal && (
        <ModalInvitarUsuario
          onClose={() => setShowInviteModal(false)}
          onInvitacionEnviada={handleInvitacionEnviada}
        />
      )}
    </div>
  );
}