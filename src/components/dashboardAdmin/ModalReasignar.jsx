// Modal para reasignar un cliente a otro contador.
// Props:
//   cliente     → objeto cliente a reasignar
//   contadores  → lista de usuarios con rol contador
//   onReasignar → callback(nuevoUsuarioId) que ejecuta el padre
//   onCerrar    → callback para cerrar el modal
//   loading     → boolean controlado por el padre

import { useState } from 'react';


export default function ModalReasignar({ cliente, contadores, onReasignar, onCerrar, loading }) {
  const [nuevoId, setNuevoId] = useState('');
  const [error, setError]     = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!nuevoId) {
      setError('Selecciona un contador.');
      return;
    }
    if (Number(nuevoId) === cliente.asignado_a_usuario_id) {
      setError('El cliente ya está asignado a este contador.');
      return;
    }

    onReasignar(Number(nuevoId));
  };

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} onClick={onCerrar}></div>
      <div
        className="modal fade show d-block"
        style={{ zIndex: 1050, overflowY: 'auto' }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered my-4">
          <div className="modal-content">

            {/* Header */}
            <div className="modal-header bg-warning text-dark">
              <h5 className="modal-title">
                <i className="bi bi-arrow-left-right me-2"></i>
                Reasignar Cliente
              </h5>
              <button className="btn-close" onClick={onCerrar} disabled={loading}></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">

                {/* Info del cliente */}
                <p className="mb-1 small text-muted">Cliente:</p>
                <p className="fw-semibold mb-3">
                  {cliente.razon_social}
                  <span className="text-muted fw-normal ms-2">({cliente.rut})</span>
                </p>

                {error && (
                  <div className="alert alert-danger py-2 small">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
                  </div>
                )}

                {/* Selector de contador */}
                <label className="form-label fw-semibold small">Asignar a:</label>
                <select
                  className="form-select"
                  value={nuevoId}
                  onChange={e => setNuevoId(e.target.value)}
                  disabled={loading}
                >
                  <option value="">— Selecciona un contador —</option>
                  {contadores.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} {c.apellido ?? ''} ({c.email})
                      {c.id === cliente.asignado_a_usuario_id ? ' ← actual' : ''}
                    </option>
                  ))}
                </select>

              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm"
                  onClick={onCerrar} disabled={loading}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-warning btn-sm text-dark" disabled={loading}>
                  {loading
                    ? <><span className="spinner-border spinner-border-sm me-2"></span>Reasignando...</>
                    : <><i className="bi bi-arrow-left-right me-2"></i>Confirmar reasignación</>
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