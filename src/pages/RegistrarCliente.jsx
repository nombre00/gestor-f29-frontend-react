// Acá el contador puede registrar sus clientes que van a estar asociados a su cuenta.

// Página para registrar un nuevo cliente asociado al contador logueado.
// Consume POST /api/clientes
// El backend asigna automáticamente al contador como responsable del cliente.


// Bibliotecas.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Módulos.
import api from '../api/api';
import { CLIENTE_FORM_INICIAL, crearCliente } from '../services/clienteService';
import Campo from '../components/campo';



// ── Componente principal ───────────────────────────────────────────────────────
export default function RegistrarCliente() {
  // Hooks
  const [formData, setFormData] = useState(CLIENTE_FORM_INICIAL);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const navigate = useNavigate();

  // Handlers
  // Cuando algo cambia en el formulario para re-renderearlo.
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // onChange recibe (field, value) igual que handleChange para ser intercambiable.
  const handleRutChange = (field, value) => {
    const limpio = value.replace(/[^0-9kK-]/g, '').toUpperCase();
    handleChange(field, limpio);
  };

  // Cuando presionamos el botón registrar cliente.
  const handleSubmit = async (e) => {
    e.preventDefault();  // Evita los valores default.
    setError('');  // Inicializamos el texto del error.
    if (!formData.rut || !formData.razon_social) {  // rut y razon soical deben estar ingresados.
      setError('RUT y Razón Social son obligatorios.');
      return;
    }
    if (formData.rut.replace('-', '').replace('K', '').length < 7) {  // Verifica la longitud del rut.
      setError('El RUT ingresado no es válido.');
      return;
    }
    setLoading(true);  // Si todo bien cambiamos el estado del controlador del spiner.
    try {  // Intentamos: 
      const payload = Object.fromEntries(Object.entries(formData).filter(([, v]) => v !== ''));  // Serializamos a un JSON.
      // await api.post('/api/clientes', payload);
      await crearCliente(payload)  // LLamamos al service.
      navigate('/inicio', {state: { mensaje: `Cliente "${formData.razon_social}" registrado correctamente.` }}); // Navegamos al inicio.
    } catch (err) {  // Si error: 
      setError(err.response?.data?.detail || err.message || 'Error al registrar cliente.');
    } finally {  // Finalmente cambiamos el estado del controlador del spiner.
      setLoading(false);
    }
  };

  // Props comunes que comparten todos los campos.
  const campoBase = { onChange: handleChange, disabled: loading };

  
  return (
    <div className="container py-4" style={{ maxWidth: '780px' }}>

      {/* Header */}
      <div className="mb-4">
        <button
          className="btn btn-link text-muted p-0 mb-2 text-decoration-none"
          onClick={() => navigate('/inicio')}
        >
          <i className="bi bi-arrow-left me-1"></i>Volver al dashboard
        </button>
        <h3 className="text-primary mb-0">
          <i className="bi bi-building-add me-2"></i>
          Registrar Cliente
        </h3>
        <p className="text-muted small mt-1">
          El cliente quedará asignado a tu cuenta automáticamente.
        </p>
      </div>

      {/* Error global */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/*  Sección 1: Datos del cliente  */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-primary text-white py-3">
            <h6 className="mb-0">
              <i className="bi bi-building me-2"></i>
              Datos del Cliente
            </h6>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4">
                <Campo {...campoBase} label="RUT" field="rut"
                  value={formData.rut} placeholder="12345678-9"
                  requerido onChangeFn={handleRutChange}
                />
              </div>
              <div className="col-md-8">
                <Campo {...campoBase} label="Razón Social" field="razon_social"
                  value={formData.razon_social} placeholder="Empresa S.A." requerido
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Campo {...campoBase} label="Nombre Comercial" field="nombre_comercial"
                  value={formData.nombre_comercial} placeholder="Nombre por el que se conoce"
                />
              </div>
              <div className="col-md-6">
                <Campo {...campoBase} label="Giro" field="giro"
                  value={formData.giro} placeholder="Comercio al por menor"
                />
              </div>
            </div>
            <Campo {...campoBase} label="Actividad Económica" field="actividad_economica"
              value={formData.actividad_economica} placeholder="Código o descripción SII"
            />
          </div>
        </div>

        {/*  Sección 2: Dirección  */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-secondary text-white py-3">
            <h6 className="mb-0">
              <i className="bi bi-geo-alt me-2"></i>
              Dirección
              <span className="fw-normal opacity-75 ms-1">(opcional)</span>
            </h6>
          </div>
          <div className="card-body">
            <Campo {...campoBase} label="Dirección" field="direccion"
              value={formData.direccion} placeholder="Av. Siempre Viva 742"
            />
            <div className="row">
              <div className="col-md-6">
                <Campo {...campoBase} label="Comuna" field="comuna"
                  value={formData.comuna} placeholder="Las Condes"
                />
              </div>
              <div className="col-md-6">
                <Campo {...campoBase} label="Ciudad" field="ciudad"
                  value={formData.ciudad} placeholder="Santiago"
                />
              </div>
            </div>
          </div>
        </div>

        {/*  Sección 3: Contacto  */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-info text-white py-3">
            <h6 className="mb-0">
              <i className="bi bi-person-lines-fill me-2"></i>
              Contacto
              <span className="fw-normal opacity-75 ms-1">(opcional)</span>
            </h6>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4">
                <Campo {...campoBase} label="Nombre de contacto" field="contacto_nombre"
                  value={formData.contacto_nombre} placeholder="Juan Pérez"
                />
              </div>
              <div className="col-md-4">
                <Campo {...campoBase} label="Email de contacto" field="contacto_email"
                  tipo="email" value={formData.contacto_email} placeholder="contacto@empresa.cl"
                />
              </div>
              <div className="col-md-4">
                <Campo {...campoBase} label="Teléfono" field="contacto_telefono"
                  tipo="tel" value={formData.contacto_telefono} placeholder="+56 9 1234 5678"
                />
              </div>
            </div>
          </div>
        </div>

        {/*  Acciones  */}
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/inicio')} disabled={loading}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Registrando...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle-fill me-2"></i>
                Registrar Cliente
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}