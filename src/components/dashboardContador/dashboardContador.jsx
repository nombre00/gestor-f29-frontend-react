// Dashboard del contador para gestionar clientes. 

// Dashboard del contador: tabla unificada de clientes con estado F29 mensual y anual.
// Consume GET /api/resumenes/dashboard → { resumenes_hechos, clientes_pendientes, total_hechos, total_pendientes }

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerDashboardContador, eliminarResumen, cambiarEstadoResumen } from '../../services/resumenesService';

// Nombres de meses en español.
const MESES = [
  '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];


export default function DashboardContador({ usuario }) {
  // Hooks
  const navigate = useNavigate();   // Para navegar.
  const [datos, setDatos]     = useState(null);  // Recibe los datos del dashboard.
  const [loading, setLoading] = useState(true);  // Controla el spinner.
  const [error, setError]     = useState('');    // para el mensaje de error.

  // Modal de confirmación para borrar.
  const [confirmBorrar, setConfirmBorrar] = useState(null); // { resumen_id, razon_social }

  // IDs en proceso de cambio de estado (para deshabilitar el botón mientras carga).
  const [cambiandoEstado, setCambiandoEstado] = useState(new Set());

  // Período seleccionado — por defecto el mes actual.
  const hoy = new Date();
  const [mesSel,  setMesSel]  = useState(hoy.getMonth() + 1);
  const [anioSel, setAnioSel] = useState(hoy.getFullYear());


  // Hook del dashboard.
  // Busca los datos del dashboard.
  const fetchDashboard = useCallback(async () => {
    setLoading(true);  // Cambiamos el estado del spinner.
    setError('');  // Inicializamos el mensaje de error.
    try {  // Intentamos asincronamente:
      const data = await obtenerDashboardContador({ mes: mesSel, anio: anioSel });  // LLamamos al service.
      setDatos(data);  // Asignamos los datos encontrados al hook del dashboard.
    } catch (err) {  // Si error:
      setError(err.response?.data?.detail || err.message || 'Error al cargar datos');
    } finally {  // Finalmente cambiamos el estado del spinner.
      setLoading(false);
    }
  }, [mesSel, anioSel]);  // Le pasamos estos datos para que los ocupe el service.


  // Cuando se carga la página cargamos los datos del dashboard.
  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  // Borrar.
  const handleBorrar = async (resumen_id) => {
    try {  // Intentamos asincronamente:
      await eliminarResumen(resumen_id);  // LLamamos al service.
      setConfirmBorrar(null);   // Cambiamos el estado del hook
      await fetchDashboard();   // Recargamos los datos de la página.
    } catch (err) {  // Si error:
      setConfirmBorrar(null);   // Cambiamos el estado del hook
      setError(err.message || 'Error al eliminar el resumen');
    }
  };

  //  Toggle de estado: borrador ↔ revisado 
  const handleToggleEstado = async (resumen_id, estado_actual) => {
    const nuevo_estado = estado_actual === 'borrador' ? 'revisado' : 'borrador';   // Hook del nuevo estado.
    setCambiandoEstado(prev => new Set(prev).add(resumen_id));  // Cambiamos el estado.
    try {  // Intentamos asincronamente:
      await cambiarEstadoResumen(resumen_id, nuevo_estado);  // LLamamos al service.
      await fetchDashboard();   // Recargamos los datos de la página.
    } catch (err) {  // Si error:
      setError(err.message || 'Error al cambiar el estado');
    } finally {  // Finalmente cambiamos el estado del toggle.
      setCambiandoEstado(prev => {
        const next = new Set(prev);
        next.delete(resumen_id);
        return next;
      });
    }
  };

  //  Tabla unificada de f29s: combina hechos + pendientes ordenados alfabéticamente 
  const filasTabla = datos
    ? [
        ...datos.resumenes_hechos.map(r => ({
          id:           r.cliente_id,
          rut:          r.rut_cliente,
          razon_social: r.razon_social_cliente,
          f29_hecho:    true,
          estado_f29:   r.estado,   // borrador | revisado
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

  //  Badge de estado F29 
  const BadgeF29 = ({ hecho, estado }) => {
    if (!hecho) return (  // Si no está hecho:
      <span className="badge bg-warning text-dark">
        <i className="bi bi-clock-fill me-1"></i>Pendiente
      </span>
    );
    const config = {  // Si está hecho creamos los badges.
      borrador: { cls: 'bg-secondary', label: 'Borrador' },
      revisado: { cls: 'bg-info text-dark', label: 'Revisado' },
    };
    const { cls, label } = config[estado] ?? { cls: 'bg-secondary', label: estado };  // Asignamos acorde al estado del f29.
    return (  // Retornamos el componente rendereable.
      <span className={`badge ${cls}`}>
        <i className="bi bi-check-circle-fill me-1"></i>{label}
      </span>
    );
  };

  // Rango de años para el selector.
  const hoydia = new Date();
  const añoActual = hoydia.getFullYear();
  const añoInicio = 1980;
  const añoFin = añoActual + 1;
  const anios = Array.from({ length: añoFin - añoInicio + 1 },(_, i) => añoInicio + i);


  
  
  return (
    <div className="container-fluid py-4">
      {/*  Header  */}
      <div
        className="card border-0 shadow-sm mb-4" style={{ background: 'linear-gradient(135deg, #1a56db 0%, #6c3fb5 100%)' }}
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
            <button className="btn btn-light btn-sm" onClick={fetchDashboard} disabled={loading} title="Actualizar">
              <i className={`bi bi-arrow-clockwise${loading ? ' spin' : ''}`}></i>
            </button>
          </div>
        </div>
      </div>
      {/*  Cards de resumen  */}
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
      {/*  Tabla de clientes  */}
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
          {/*  Cargando  */}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2 text-muted small">Cargando clientes...</p>
            </div>
          )}
          {/*  Error  */}
          {!loading && error && (
            <div className="alert alert-danger m-3">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
              <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchDashboard}>
                Reintentar
              </button>
            </div>
          )}
          {/*  Sin clientes  */}
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
                    <th>Nombre</th>
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
                        <span className="fw-semibold">{fila.nombre || fila.razon_social}</span>
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
                        {fila.f29_hecho ? (
                          <div className="d-flex justify-content-center gap-2 flex-wrap">
                            {/* Editar → /resumen con id_bd en state (evita exponer IDs en URL) */}
                            <button
                              className="btn btn-sm btn-outline-primary"
                              title="Editar F29"
                              onClick={() => navigate('/resumen', { state: { id_bd: fila.resumen_id, cliente_id: fila.id } })}
                            >
                              <i className="bi bi-pencil-fill me-1"></i>Editar
                            </button>

                            {/* Toggle estado: borrador ↔ revisado */}
                            <button
                              className={`btn btn-sm ${fila.estado_f29 === 'borrador' ? 'btn-outline-info' : 'btn-outline-secondary'}`}
                              title={fila.estado_f29 === 'borrador' ? 'Marcar como revisado' : 'Volver a borrador'}
                              disabled={cambiandoEstado.has(fila.resumen_id)}
                              onClick={() => handleToggleEstado(fila.resumen_id, fila.estado_f29)}
                            >
                              {cambiandoEstado.has(fila.resumen_id)
                                ? <span className="spinner-border spinner-border-sm" role="status"></span>
                                : fila.estado_f29 === 'borrador'
                                  ? <><i className="bi bi-check2-circle me-1"></i>Revisar</>
                                  : <><i className="bi bi-arrow-counterclockwise me-1"></i>Borrador</>
                              }
                            </button>
                            {/* Borrar — solo disponible en estado borrador */}
                            {fila.estado_f29 === 'borrador' && (
                              <button
                                className="btn btn-sm btn-outline-danger"
                                title="Borrar F29"
                                onClick={() => setConfirmBorrar({ resumen_id: fila.resumen_id, razon_social: fila.razon_social })}
                              >
                                <i className="bi bi-trash-fill me-1"></i>Borrar
                              </button>
                            )}
                          </div>
                        ) : (
                          /* Generar -> /gestor pasando cliente_id en state */
                          <button
                            className="btn btn-sm btn-outline-success"
                            title="Generar F29"
                            onClick={() => navigate('/gestor', { state: { cliente_id: fila.id } })}
                          >
                            <i className="bi bi-file-earmark-plus me-1"></i>Generar F29
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {/*  Modal confirmación borrar  */}
      {confirmBorrar && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
          <div className="modal fade show d-block" style={{ zIndex: 1050 }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title text-danger">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    Confirmar eliminación
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setConfirmBorrar(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p className="mb-1">
                    ¿Estás seguro de que deseas eliminar el F29 de{' '}
                    <strong>{confirmBorrar.razon_social}</strong>?
                  </p>
                  <p className="text-muted small mb-0">Esta acción no se puede deshacer.</p>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setConfirmBorrar(null)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleBorrar(confirmBorrar.resumen_id)}
                  >
                    <i className="bi bi-trash-fill me-1"></i>Sí, eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/*  Animación spin para el botón de refresh  */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { display: inline-block; animation: spin 0.8s linear infinite; }
      `}</style>
    </div>
  );
}