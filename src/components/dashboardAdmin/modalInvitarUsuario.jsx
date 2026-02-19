// Componente para invitar usuario.

// Modal para invitar nuevos usuarios al sistema

import { useState } from 'react';
import { crearInvitacion } from '../../services/invitacionesService';

export default function ModalInvitarUsuario({ onClose, onInvitacionEnviada }) {
  const [formData, setFormData] = useState({
    email: '',
    rol: 'contador',
    nombre: '',
    apellido: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Actualizar campos del formulario
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Enviar invitación
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.email || !formData.nombre) {
      setError('Email y nombre son obligatorios');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Email inválido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await crearInvitacion(formData);
      alert('Invitación enviada exitosamente');
      onInvitacionEnviada();
    } catch (err) {
      setError(err.message || 'Error al enviar invitación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop oscuro */}
      <div 
        className="modal-backdrop fade show" 
        onClick={onClose}
        style={{ zIndex: 1040 }}
      ></div>

      {/* Modal */}
      <div 
        className="modal fade show d-block" 
        tabIndex="-1" 
        style={{ zIndex: 1050 }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                <i className="bi bi-envelope-plus-fill me-2"></i>
                Invitar Nuevo Usuario
              </h5>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={onClose}
                disabled={loading}
              ></button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show">
                    {error}
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setError('')}
                    ></button>
                  </div>
                )}

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="usuario@empresa.cl"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                    disabled={loading}
                  />
                  <small className="text-muted">
                    Se enviará un email de invitación a esta dirección
                  </small>
                </div>

                {/* Nombre */}
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Nombre <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Juan"
                    value={formData.nombre}
                    onChange={(e) => handleChange('nombre', e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                {/* Apellido */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Apellido</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Pérez"
                    value={formData.apellido}
                    onChange={(e) => handleChange('apellido', e.target.value)}
                    disabled={loading}
                  />
                </div>

                {/* Rol */}
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Rol <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    value={formData.rol}
                    onChange={(e) => handleChange('rol', e.target.value)}
                    required
                    disabled={loading}
                  >
                    <option value="contador">Contador</option>
                    <option value="asistente">Asistente</option>
                    <option value="admin">Administrador</option>
                  </select>
                  <small className="text-muted">
                    {formData.rol === 'admin' && '⚠️ Tendrá acceso completo al sistema'}
                    {formData.rol === 'contador' && 'Puede gestionar F29 y clientes asignados'}
                    {formData.rol === 'asistente' && 'Acceso limitado de solo lectura'}
                  </small>
                </div>

                <div className="alert alert-info mb-0">
                  <i className="bi bi-info-circle-fill me-2"></i>
                  El usuario recibirá un email con un link para completar su registro. 
                  El link expirará en 7 días.
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send-fill me-2"></i>
                      Enviar Invitación
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}