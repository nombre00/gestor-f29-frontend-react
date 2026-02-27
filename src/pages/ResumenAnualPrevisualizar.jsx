// Acá el usuario ve los resúmenes anuales generados.


// Bibliotecas.
import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
// Componentes reutilizados (solo lectura → quitamos onChange)
import SeccionContribuyente from '../components/paginaPrevistaResumenAnual/seccionContribuyente';
import SeccionVentas from '../components/paginaPrevistaResumenAnual/seccionVentas';
import SeccionCompras from '../components/paginaPrevistaResumenAnual/seccionCompras';
import SeccionRetencionesTotal from '../components/paginaPrevistaResumenAnual/seccionRetencionesTotal';
// Servicios (ajusta los nombres según tu estructura real)
import { obtenerResumenAnual, recalcularResumenAnual } from '../services/resumenesService';
import { exportarResumenAExcel2 } from '../services/VistaResumenF29Service'; // reutilizamos el mismo exportador
// Utilidad de formato (ya la tienes) año
import { formatCLP } from '../services/F29Calculator';


// Hooks.
export default function VistaResumenAnual() {
  const { clienteId, anio } = useParams(); // /resumen-anual-previsualizar/:clienteId/:anio
  const navigate = useNavigate();
  const location = useLocation();

  const [resumenData, setResumenData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState('');

  // Carga inicial
  useEffect(() => {
    const fetchResumen = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await obtenerResumenAnual(clienteId, anio);
        setResumenData(data);
      } catch (err) {
        setError(err.message || 'No se pudo cargar el resumen anual');
      } finally {
        setLoading(false);
      }
    };

    fetchResumen();
  }, [clienteId, anio]);

  // Handler de recalcular
  const handleRecalcular = async () => {
    setLoadingAction(true);
    setError('');
    try {
      const updated = await recalcularResumenAnual(clienteId, anio);
      setResumenData(updated);
      alert('Resumen recalculado correctamente');
    } catch (err) {
      setError(err.message || 'Error al recalcular el resumen');
    } finally {
      setLoadingAction(false);
    }
  };

  // Handler de exportar
  const handleExport = async () => {
    if (!resumenData?.contenido) return;
    setLoadingAction(true);
    try {
      await exportarResumenAExcel2(resumenData.contenido, null); // null porque no usamos id_bd aquí
      alert('Excel generado y descargado');
    } catch (err) {
      setError(err.message || 'Error al exportar');
    } finally {
      setLoadingAction(false);
    }
  };

  // Genera los 12 badges
  const renderBadgesMeses = () => {
    if (!resumenData) return null;
    const meses = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];

    const incluidos = new Set(resumenData.periodos_incluidos || []);

    return (
      <div className="d-flex flex-wrap gap-2 justify-content-center mb-3">
        {meses.map((mes, idx) => {
          const periodo = `${resumenData.año}-${String(idx + 1).padStart(2, '0')}`;
          const estaIncluido = incluidos.has(periodo);
          return (
            <span
              key={idx}
              className={`badge ${estaIncluido ? 'bg-success' : 'bg-secondary'} fs-6 px-3 py-2`}
            >
              {mes}
            </span>
          );
        })}
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando resumen anual...</p>
      </div>
    );
  }

  if (error || !resumenData) {
    return (
      <div className="container py-5 text-center">
        <h2 className="text-danger">Error</h2>
        <p>{error || 'No se pudo cargar el resumen anual'}</p>
        <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
          Volver
        </button>
      </div>
    );
  }

  const { contenido, rango_texto, meses_incluidos_count, estado } = resumenData;
  const esRevisado = estado === 'revisado';

  return (
    <div className="container py-5 position-relative">
      <h1 className="mb-4 text-primary text-center">
        Resumen Formulario 29 Acumulado
      </h1>

      {/* Card superior con badges y progreso */}
      <div className="card mb-5 shadow border-primary">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            {rango_texto || `Año ${resumenData.anio}`}
          </h5>
        </div>
        <div className="card-body">
          {renderBadgesMeses()}
          <div className="text-center mt-3">
            <h6>
              <span className={meses_incluidos_count === 12 ? 'text-success' : 'text-warning'}>
                {meses_incluidos_count} de 12 meses incluidos
              </span>
            </h6>
          </div>
        </div>
      </div>

      {/* Banner de solo lectura si está revisado */}
      {esRevisado && (
        <div className="alert alert-info d-flex align-items-center gap-2 mb-4">
          <i className="bi bi-lock-fill fs-5"></i>
          <span>
            Este resumen está en estado <strong>Revisado</strong> (solo lectura).
          </span>
        </div>
      )}

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      {/* Secciones reutilizadas – solo lectura */}
      <SeccionContribuyente resumen={contenido} />

      <SeccionVentas
        ventasDetalle={contenido.ventas_detalle || []}
        ventasTotal={contenido.ventas_total || {}}
        // sin onChange → solo lectura
      />

      <SeccionCompras
        comprasDetalle={contenido.compras_detalle || []}
        comprasTotal={contenido.compras_total || {}}
        IVAPP={contenido.IVAPP || 0}
        remanente={contenido.remanente || 0}
        // sin onChange
      />

      <SeccionRetencionesTotal
        remuneraciones={contenido.remuneraciones || {}}
        honorarios={contenido.honorarios || {}}
        ppm={contenido.ppm || {}}
        TT={contenido.TT || 0}
        // sin handlers
      />

      {/* Datos adicionales – solo lectura */}
      <div className="card mb-4 shadow-sm border-secondary">
        <div className="card-header bg-secondary text-white">
          <h5 className="mb-0">Datos adicionales (no afectan F29)</h5>
        </div>
        <div className="card-body">
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label fw-bold">Arriendos pagados</label>
              <div className="form-control-plaintext text-end fw-bold">
                {formatCLP(contenido.arriendos_pagados || 0)}
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Gastos generales (boletas)</label>
              <div className="form-control-plaintext text-end fw-bold">
                {formatCLP(contenido.gastos_generales_boletas || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="d-flex gap-4 justify-content-center mt-5">
        <button
          className="btn btn-primary btn-lg px-5"
          onClick={handleRecalcular}
          disabled={loadingAction}
        >
          {loadingAction ? 'Recalculando...' : 'Recalcular desde F29 existentes'}
        </button>

        <button
          className="btn btn-success btn-lg px-5"
          onClick={handleExport}
          disabled={loadingAction}
        >
          {loadingAction ? 'Generando...' : 'Exportar a Excel'}
        </button>

        <button
          className="btn btn-outline-secondary btn-lg px-5"
          onClick={() => navigate(-1)}
        >
          Volver
        </button>
      </div>

      {/* Overlay de carga */}
      {loadingAction && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
          style={{ zIndex: 9999 }}
        >
          <div className="card p-4 text-center bg-white shadow">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Procesando...</span>
            </div>
            <p>Actualizando resumen...</p>
          </div>
        </div>
      )}
    </div>
  );
}