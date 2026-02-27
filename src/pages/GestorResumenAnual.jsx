// pages/GestorResumenAnual.jsx

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Servicio (ya lo tienes en resumenesService.js)
import { obtenerDashboardResumenAnual } from '../services/resumenesService';
import { useAuth } from '../context/AuthContext';

// Años disponibles (últimos 5 + próximo)  usuario.nombre
const ANIOS = (() => {
  const hoy = new Date().getFullYear();
  return Array.from({ length: 6 }, (_, i) => hoy - 2 + i);
})();

export default function GestorResumenAnual() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [datos, setDatos] = useState(null);
  const [anioSel, setAnioSel] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDatos = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await obtenerDashboardResumenAnual(anioSel);
      setDatos(data);
    } catch (err) {
      setError(err.message || 'Error al cargar clientes para resumen anual');
    } finally {
      setLoading(false);
    }
  }, [anioSel]);

  useEffect(() => {
    fetchDatos();
  }, [fetchDatos]);

  const handleIrAlResumen = (clienteId, existe) => {
    navigate(`/resumen-anual-previsualizar/${clienteId}/${anioSel}`);
  };

  // Badge de estado resumen anual
  const BadgeEstadoAnual = ({ existe, estado, mesesIncluidos, f29Pendientes }) => {
    if (!existe) {
      return (
        <span className="badge bg-warning text-dark">
          <i className="bi bi-hourglass-split me-1"></i>Pendiente
        </span>
      );
    }

    const config = {
      borrador: { cls: 'bg-secondary', label: 'Borrador' },
      revisado: { cls: 'bg-info text-dark', label: 'Revisado' },
    };
    const { cls, label } = config[estado] ?? { cls: 'bg-secondary', label: estado || 'Desconocido' };

    return (
      <div className="d-flex flex-column align-items-center gap-1">
        <span className={`badge ${cls}`}>
          <i className="bi bi-check-circle-fill me-1"></i>{label}
        </span>
        <small className="text-muted">
          {mesesIncluidos} de 12 meses
        </small>
        {f29Pendientes > 0 && (
          <span className="badge bg-danger mt-1">
            +{f29Pendientes} nuevos
          </span>
        )}
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="container-fluid py-4">

      {/* Header con selector de año */}
      <div
        className="card border-0 shadow-sm mb-4"
        style={{ background: 'linear-gradient(135deg, #1a56db 0%, #6c3fb5 100%)' }}
      >
        <div className="card-body text-white p-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h4 className="mb-1">
              <i className="bi bi-graph-up-arrow me-2"></i>
              Resúmenes Anuales
            </h4>
            <p className="mb-0 opacity-75 small">
              <i className="bi bi-building me-1"></i>
              {user.empresa || ''}
            </p>
          </div>

          {/* Selector de año */}
          <div className="d-flex align-items-center gap-2">
            <span className="text-white opacity-75 small">Año:</span>
            <select
              className="form-select form-select-sm"
              style={{ width: 'auto' }}
              value={anioSel}
              onChange={(e) => setAnioSel(Number(e.target.value))}
              disabled={loading}
            >
              {ANIOS.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <button
              className="btn btn-light btn-sm"
              onClick={fetchDatos}
              disabled={loading}
              title="Actualizar"
            >
              <i className={`bi bi-arrow-clockwise${loading ? ' spin' : ''}`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Tarjetas resumen */}
      <div className="row g-3 mb-4">
        {[
          {
            valor: datos ? datos.total_clientes || 0 : '—',
            label: 'Total clientes',
            icono: 'bi-building',
            color: 'text-primary',
          },
          {
            valor: datos ? datos.total_generados || 0 : '—',
            label: 'Resúmenes anuales generados',
            icono: 'bi-check-circle-fill',
            color: 'text-success',
          },
          {
            valor: datos ? datos.total_pendientes || 0 : '—',
            label: 'Pendientes de generar',
            icono: 'bi-clock-fill',
            color: 'text-warning',
          },
        ].map(({ valor, label, icono, color }) => (
          <div className="col-sm-4" key={label}>
            <div className="card border-0 shadow-sm text-center py-3">
              <div className="card-body">
                <div className={`fs-2 fw-bold ${color}`}>{valor}</div>
                <div className="text-muted small">
                  <i className={`bi ${icono} me-1`}></i>{label}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabla de clientes */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
          <h5 className="mb-0 text-primary">
            <i className="bi bi-people-fill me-2"></i>
            Mis Clientes — Resumen Anual {anioSel}
          </h5>
          <span className="badge bg-primary rounded-pill">
            {datos ? datos.total_clientes || 0 : 0}
          </span>
        </div>

        <div className="card-body p-0">
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2 text-muted small">Cargando clientes...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-danger m-3">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
              <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchDatos}>
                Reintentar
              </button>
            </div>
          )}

          {!loading && !error && (!datos || !datos.clientes || datos.clientes.length === 0) && (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox fs-1 d-block mb-3"></i>
              <p className="mb-0">No tienes clientes asignados.</p>
              <p className="small">Contacta al administrador.</p>
            </div>
          )}

          {!loading && !error && datos?.clientes?.length > 0 && (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Nombre</th>
                    <th>RUT</th>
                    <th className="text-center">Estado Resumen {anioSel}</th>
                    <th className="text-center">Meses incluidos</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.clientes.map(cliente => {
                    const ra = cliente.resumen_anual || {};
                    const existe = ra.existe || false;
                    const meses = ra.meses_incluidos || 0;
                    const nuevos = ra.f29_pendientes || 0;

                    return (
                      <tr key={cliente.id}>
                        {/* Nombre del cliente */}
                        <td>
                          <i className="bi bi-building me-2 text-primary"></i>
                          <span className="fw-semibold">{cliente.nombre || '-'}</span>
                        </td>

                        <td className="text-muted">{cliente.rut || '-'}</td>

                        <td className="text-center">
                          <BadgeEstadoAnual
                            existe={existe}
                            estado={ra.estado}
                            mesesIncluidos={meses}
                            f29Pendientes={nuevos}
                          />
                        </td>

                        <td className="text-center">
                          {existe ? (
                            <span className="badge bg-info">
                              {meses} de 12
                            </span>
                          ) : (
                            <span className="badge bg-secondary">0 de 12</span>
                          )}
                          {nuevos > 0 && (
                            <span className="badge bg-danger ms-2">
                              +{nuevos} nuevos
                            </span>
                          )}
                        </td>

                        <td className="text-center">
                          <button
                            className={`btn btn-sm ${existe ? 'btn-outline-primary' : 'btn-outline-success'}`}
                            onClick={() => handleIrAlResumen(cliente.id, existe)}
                          >
                            {existe ? (
                              <>
                                <i className="bi bi-eye-fill me-1"></i>Ver Resumen
                              </>
                            ) : (
                              <>
                                <i className="bi bi-plus-circle-fill me-1"></i>Generar Resumen
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Estilo para spin */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { display: inline-block; animation: spin 0.8s linear infinite; }
      `}</style>
    </div>
  );
}