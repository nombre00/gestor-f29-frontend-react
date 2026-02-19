// Dashboard del contador para gestionar clientes.

// Dashboard del contador: tabla unificada de clientes con estado F29 mensual y anual.
// Consume GET /api/resumenes/dashboard → { resumenes_hechos, clientes_pendientes, total_hechos, total_pendientes }

import { useState, useEffect, useCallback } from 'react';
import { obtenerDashboardContador } from '../../services/resumenesService';

// Nombres de meses en español.
const MESES = [
  '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function DashboardContador({ usuario }) {
  const [datos, setDatos]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // Período seleccionado — por defecto el mes actual.
  const hoy = new Date();
  const [mesSel,  setMesSel]  = useState(hoy.getMonth() + 1);
  const [anioSel, setAnioSel] = useState(hoy.getFullYear());

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await obtenerDashboardContador({ mes: mesSel, anio: anioSel });
      setDatos(data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }, [mesSel, anioSel]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  // ── Tabla unificada: combina hechos + pendientes ordenados alfabéticamente ──
  const filasTabla = datos
    ? [
        ...datos.resumenes_hechos.map(r => ({
          id:           r.cliente_id,
          rut:          r.rut_cliente,
          razon_social: r.razon_social_cliente,
          f29_hecho:    true,
          estado_f29:   r.estado,   // borrador | revisado | enviado | pagado
          resumen_id:   r.id,
        })),
        ...datos.clientes_pendientes.map(c => ({
          id:           c.id,
          rut:          c.rut,
          razon_social: c.razon_social,
          f29_hecho:    false,
          estado_f29:   null,
          resumen_id:   null,
        })),
      ].sort((a, b) => a.razon_social.localeCompare(b.razon_social, 'es'))
    : [];

  // ── Badge de estado F29 ───────────────────────────────────────────────────
  const BadgeF29 = ({ hecho, estado }) => {
    if (!hecho) return (
      <span className="badge bg-warning text-dark">
        <i className="bi bi-clock-fill me-1"></i>Pendiente
      </span>
    );

    const config = {
      borrador: { cls: 'bg-secondary',       label: 'Borrador' },
      revisado: { cls: 'bg-info text-dark',  label: 'Revisado' },
      enviado:  { cls: 'bg-primary',         label: 'Enviado'  },
      pagado:   { cls: 'bg-success',         label: 'Pagado'   },
    };
    const { cls, label } = config[estado] ?? { cls: 'bg-secondary', label: estado };
    return (
      <span className={`badge ${cls}`}>
        <i className="bi bi-check-circle-fill me-1"></i>{label}
      </span>
    );
  };

  // Rango de años para el selector.
  const anios = Array.from({ length: 4 }, (_, i) => hoy.getFullYear() - i);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="container-fluid py-4">

      {/* ── Header ───────────────────────────────────────────────────── */}
      <div
        className="card border-0 shadow-sm mb-4"
        style={{ background: 'linear-gradient(135deg, #1a56db 0%, #6c3fb5 100%)' }}
      >
        <div className="card-body text-white p-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h4 className="mb-1">
              <i className="bi bi-person-circle me-2"></i>
              {usuario.nombre} {usuario.apellido || ''}
            </h4>
            <p className="mb-0 opacity-75 small">
              <i className="bi bi-building me-1"></i>
              {usuario.empresa || ''}
            </p>
          </div>

          {/* Selector de período */}
          <div className="d-flex align-items-center gap-2">
            <span className="text-white opacity-75 small">Período:</span>
            <select
              className="form-select form-select-sm"
              style={{ width: 'auto' }}
              value={mesSel}
              onChange={e => setMesSel(Number(e.target.value))}
              disabled={loading}
            >
              {MESES.slice(1).map((nombre, i) => (
                <option key={i + 1} value={i + 1}>{nombre}</option>
              ))}
            </select>
            <select
              className="form-select form-select-sm"
              style={{ width: 'auto' }}
              value={anioSel}
              onChange={e => setAnioSel(Number(e.target.value))}
              disabled={loading}
            >
              {anios.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <button
              className="btn btn-light btn-sm"
              onClick={fetchDashboard}
              disabled={loading}
              title="Actualizar"
            >
              <i className={`bi bi-arrow-clockwise${loading ? ' spin' : ''}`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* ── Cards de resumen ─────────────────────────────────────────── */}
      <div className="row g-3 mb-4">
        {[
          {
            valor: datos ? datos.total_hechos + datos.total_pendientes : '—',
            label: 'Total clientes',
            icono: 'bi-building',
            color: 'text-primary',
          },
          {
            valor: datos ? datos.total_hechos : '—',
            label: 'F29 completados',
            icono: 'bi-check-circle-fill',
            color: 'text-success',
          },
          {
            valor: datos ? datos.total_pendientes : '—',
            label: 'F29 pendientes',
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

      {/* ── Tabla de clientes ────────────────────────────────────────── */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
          <h5 className="mb-0 text-primary">
            <i className="bi bi-people-fill me-2"></i>
            Mis Clientes —&nbsp;
            <span className="fw-normal text-muted">{MESES[mesSel]} {anioSel}</span>
          </h5>
          <span className="badge bg-primary rounded-pill">{filasTabla.length}</span>
        </div>

        <div className="card-body p-0">

          {/* Cargando */}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2 text-muted small">Cargando clientes...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="alert alert-danger m-3">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
              <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchDashboard}>
                Reintentar
              </button>
            </div>
          )}

          {/* Sin clientes */}
          {!loading && !error && filasTabla.length === 0 && (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox fs-1 d-block mb-3"></i>
              <p className="mb-0">No tienes clientes asignados para este período.</p>
              <p className="small">Contacta al administrador para que te asigne clientes.</p>
            </div>
          )}

          {/* Tabla */}
          {!loading && !error && filasTabla.length > 0 && (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Razón Social</th>
                    <th>RUT</th>
                    <th className="text-center">F29 — {MESES[mesSel]} {anioSel}</th>
                    <th className="text-center">
                      Informe Anual {anioSel}
                      <span className="badge bg-secondary ms-2 fw-normal" style={{ fontSize: '0.65rem' }}>
                        Próximamente
                      </span>
                    </th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filasTabla.map(fila => (
                    <tr key={fila.id}>

                      {/* Razón Social */}
                      <td>
                        <i className="bi bi-building me-2 text-primary"></i>
                        <span className="fw-semibold">{fila.razon_social}</span>
                      </td>

                      {/* RUT */}
                      <td className="text-muted">{fila.rut}</td>

                      {/* F29 del mes */}
                      <td className="text-center">
                        <BadgeF29 hecho={fila.f29_hecho} estado={fila.estado_f29} />
                      </td>

                      {/* Informe anual — placeholder */}
                      <td className="text-center">
                        <span className="badge bg-light text-secondary border">
                          <i className="bi bi-hourglass-split me-1"></i>No disponible
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="text-center">
                        <a
                          href={`/gestor?cliente=${fila.id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          <i className={`bi ${fila.f29_hecho ? 'bi-eye' : 'bi-file-earmark-plus'} me-1`}></i>
                          {fila.f29_hecho ? 'Ver F29' : 'Generar F29'}
                        </a>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Animación spin para el botón de refresh */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { display: inline-block; animation: spin 0.8s linear infinite; }
      `}</style>
    </div>
  );
}