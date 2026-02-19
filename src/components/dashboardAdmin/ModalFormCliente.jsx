// Modal para crear o editar un cliente.
// Props:
//   cliente     → null = modo crear | objeto = modo editar
//   contadores  → lista de usuarios con rol contador para el selector de asignación
//   onGuardar   → callback(payload) que ejecuta el padre
//   onCerrar    → callback para cerrar el modal
//   loading     → boolean controlado por el padre

import Campo from '../campo';
import { useState } from 'react';
import { CLIENTE_FORM_INICIAL } from '../../services/clienteService';


// Filtra caracteres inválidos del RUT chileno.
const limpiarRut = (_, value) =>
  value.replace(/[^0-9kK-]/g, '').toUpperCase();


export default function ModalFormCliente({ cliente, contadores, onGuardar, onCerrar, loading }) {
  const esEdicion = !!cliente;

  const [form, setForm] = useState(
    esEdicion
      ? {
          rut:                 cliente.rut,
          razon_social:        cliente.razon_social,
          nombre_comercial:    cliente.nombre_comercial    ?? '',
          giro:                cliente.giro                ?? '',
          actividad_economica: cliente.actividad_economica ?? '',
          direccion:           cliente.direccion           ?? '',
          comuna:              cliente.comuna              ?? '',
          ciudad:              cliente.ciudad              ?? '',
          contacto_nombre:     cliente.contacto_nombre     ?? '',
          contacto_email:      cliente.contacto_email      ?? '',
          contacto_telefono:   cliente.contacto_telefono   ?? '',
          asignado_a_usuario_id: String(cliente.asignado_a_usuario_id ?? ''),
        }
      : { ...CLIENTE_FORM_INICIAL, asignado_a_usuario_id: '' }
  );

  const [error, setError] = useState('');

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.rut || !form.razon_social) {
      setError('RUT y Razón Social son obligatorios.');
      return;
    }

    // Solo enviamos campos con valor.
    const payload = Object.fromEntries(
      Object.entries(form).filter(([, v]) => v !== '')
    );
    if (payload.asignado_a_usuario_id)
      payload.asignado_a_usuario_id = Number(payload.asignado_a_usuario_id);

    onGuardar(payload);
  };

  // Props comunes para todos los campos.
  const campoBase = { onChange: set, disabled: loading, size: 'sm' };

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} onClick={onCerrar}></div>
      <div className="modal fade show d-block" style={{ zIndex: 1050, overflowY: 'auto' }} tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered my-4">
          <div className="modal-content">

            {/* Header */}
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                <i className={`bi ${esEdicion ? 'bi-pencil-fill' : 'bi-building-add'} me-2`}></i>
                {esEdicion ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h5>
              <button className="btn-close btn-close-white" onClick={onCerrar} disabled={loading}></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">

                {error && (
                  <div className="alert alert-danger py-2 small">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
                  </div>
                )}

                {/* Datos principales */}
                <p className="text-muted small fw-semibold mb-2 text-uppercase">Datos del cliente</p>
                <div className="row">
                  <div className="col-md-4">
                    <Campo {...campoBase} label="RUT" field="rut"
                      value={form.rut} placeholder="12345678-9"
                      requerido onChangeFn={limpiarRut}
                    />
                  </div>
                  <div className="col-md-8">
                    <Campo {...campoBase} label="Razón Social" field="razon_social"
                      value={form.razon_social} placeholder="Empresa S.A." requerido
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <Campo {...campoBase} label="Nombre Comercial" field="nombre_comercial"
                      value={form.nombre_comercial} placeholder="Nombre visible"
                    />
                  </div>
                  <div className="col-md-6">
                    <Campo {...campoBase} label="Giro" field="giro"
                      value={form.giro} placeholder="Comercio al por menor"
                    />
                  </div>
                </div>
                <Campo {...campoBase} label="Actividad Económica" field="actividad_economica"
                  value={form.actividad_economica} placeholder="Código o descripción SII"
                />

                <hr />

                {/* Dirección */}
                <p className="text-muted small fw-semibold mb-2 text-uppercase">Dirección</p>
                <Campo {...campoBase} label="Dirección" field="direccion"
                  value={form.direccion} placeholder="Av. Siempre Viva 742"
                />
                <div className="row">
                  <div className="col-md-6">
                    <Campo {...campoBase} label="Comuna" field="comuna"
                      value={form.comuna} placeholder="Las Condes"
                    />
                  </div>
                  <div className="col-md-6">
                    <Campo {...campoBase} label="Ciudad" field="ciudad"
                      value={form.ciudad} placeholder="Santiago"
                    />
                  </div>
                </div>

                <hr />

                {/* Contacto */}
                <p className="text-muted small fw-semibold mb-2 text-uppercase">Contacto</p>
                <div className="row">
                  <div className="col-md-4">
                    <Campo {...campoBase} label="Nombre contacto" field="contacto_nombre"
                      value={form.contacto_nombre} placeholder="Juan Pérez"
                    />
                  </div>
                  <div className="col-md-4">
                    <Campo {...campoBase} label="Email contacto" field="contacto_email"
                      tipo="email" value={form.contacto_email} placeholder="contacto@empresa.cl"
                    />
                  </div>
                  <div className="col-md-4">
                    <Campo {...campoBase} label="Teléfono" field="contacto_telefono"
                      tipo="tel" value={form.contacto_telefono} placeholder="+56 9 1234 5678"
                    />
                  </div>
                </div>

                <hr />

                {/* Asignación */}
                <p className="text-muted small fw-semibold mb-2 text-uppercase">Asignación</p>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Contador asignado</label>
                  <select
                    className="form-select form-select-sm"
                    value={form.asignado_a_usuario_id}
                    onChange={e => set('asignado_a_usuario_id', e.target.value)}
                    disabled={loading}
                  >
                    <option value="">— Sin asignar (queda al admin) —</option>
                    {contadores.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.nombre} {c.apellido ?? ''} ({c.email})
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm"
                  onClick={onCerrar} disabled={loading}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                  {loading
                    ? <><span className="spinner-border spinner-border-sm me-2"></span>Guardando...</>
                    : <><i className="bi bi-check-circle-fill me-2"></i>{esEdicion ? 'Guardar cambios' : 'Crear cliente'}</>
                  }
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </>
  );
}