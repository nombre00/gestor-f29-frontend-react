// Acá se puede previsualizar y editar el resumen antes de exportarlo.

// Bibliotecas.
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Componentes
import SeccionContribuyente from '../components/paginaVistaResumen/SeccionContribuyente';
import SeccionDebitosVentas from '../components/paginaVistaResumen/SeccionDebitosVentas';
import SeccionCreditosCompras from '../components/paginaVistaResumen/SeccionCreditosCompras';
import SeccionRetencionesTotal from '../components/paginaVistaResumen/SeccionRetencionesTotal';
import NumberInput from '../components/NumberInput';
// Services
import { recalcularResumen } from '../services/F29Calculator';
import { exportarResumenAExcel2 } from '../services/VistaResumenF29Service';
import { obtenerResumenPorId } from '../services/resumenesService';


export default function ResumenF29() {
  const location  = useLocation();
  const navigate  = useNavigate();

  // ── Dos modos de entrada ──────────────────────────────────────────────────
  // 1. Desde GestorF29: location.state = { resumen, id_bd }  → datos ya en memoria.
  // 2. Desde Dashboard: location.state = { id_bd, cliente_id } → hay que hacer fetch.
  const initialResumen = location.state?.resumen || null;
  const id_bd          = location.state?.id_bd   || null;

  const [resumen,        setResumen]        = useState(null);
  const [estadoResumen,  setEstadoResumen]  = useState(null);  // 'borrador' | 'revisado'
  const [loading,        setLoading]        = useState(false);
  const [loadingInicial, setLoadingInicial] = useState(false); // carga al montar
  const [error,          setError]          = useState('');

  // ── Al montar: si tenemos resumen directo lo usamos, si no hacemos fetch ──
  useEffect(() => {
    if (initialResumen) {
      // Vino desde GestorF29 con el objeto completo
      setResumen(JSON.parse(JSON.stringify(initialResumen)));
      // El estado en este caso es siempre borrador (recién generado)
      setEstadoResumen('borrador');
      return;
    }

    if (id_bd) {
      // Vino desde el dashboard — hay que cargar desde la BD
      setLoadingInicial(true);
      obtenerResumenPorId(id_bd)
        .then(data => {
          if (!data.detalles_json) {
            setError('Este resumen no tiene datos de detalle guardados. Regenera el F29 desde el gestor.');
            return;
          }
          setResumen(JSON.parse(JSON.stringify(data.detalles_json)));
          setEstadoResumen(data.estado);  // 'borrador' | 'revisado'
        })
        .catch(err => {
          setError(err.message || 'Error al cargar el resumen');
        })
        .finally(() => setLoadingInicial(false));
      return;
    }

    // Sin datos de ningún lado
    setError('No se recibieron datos de resumen. Vuelve a cargar documentos.');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Determina si la edición está bloqueada ────────────────────────────────
  const bloqueado = estadoResumen === 'revisado';

  // ── Handlers de edición (solo actúan si no está bloqueado) ───────────────
  const handleVentaChange = (index, field, value) => {
    if (bloqueado) return;
    setResumen((prev) => {
      const updated = [...prev.ventas_detalle];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, ventas_detalle: updated };
    });
  };

  const handleCompraChange = (index, field, value) => {
    if (bloqueado) return;
    setResumen((prev) => {
      const updated = [...prev.compras_detalle];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, compras_detalle: updated };
    });
  };

  const handleRemChange = (field, value) => {
    if (bloqueado) return;
    setResumen((prev) => ({
      ...prev,
      remuneraciones: { ...prev.remuneraciones, [field]: value },
    }));
  };

  const handleHonChange = (field, value) => {
    if (bloqueado) return;
    setResumen((prev) => ({
      ...prev,
      honorarios: { ...prev.honorarios, [field]: value },
    }));
  };

  const handlePpmChange = (field, value) => {
    if (bloqueado) return;
    setResumen((prev) => ({
      ...prev,
      ppm: { ...prev.ppm, [field]: value },
    }));
  };

  const handleApplyChanges = () => {
    if (bloqueado) return;
    setLoading(true);
    setError('');
    try {
      const copy    = JSON.parse(JSON.stringify(resumen));
      const updated = recalcularResumen(copy);
      setResumen(updated);
      alert('Cambios aplicados y totales recalculados');
    } catch (err) {
      setError('Error al recalcular: ' + (err.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!resumen) return;
    setLoading(true);
    setError('');
    try {
      await exportarResumenAExcel2(resumen, id_bd);
      alert('Excel generado y descargado correctamente');
    } catch (err) {
      setError(err.message || 'Error al exportar el resumen');
    } finally {
      setLoading(false);
    }
  };

  // ── Estados de carga y error ──────────────────────────────────────────────
  if (loadingInicial) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="text-muted">Cargando resumen...</p>
      </div>
    );
  }

  if (!resumen) {
    return (
      <div className="container py-5 text-center">
        <h2 className="text-danger">No hay datos disponibles</h2>
        {error && <p className="text-muted mt-2">{error}</p>}
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate('/gestor')}
        >
          Volver a Gestor F29
        </button>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="container py-5 position-relative">
      <h1 className="mb-3 text-primary text-center">Resumen Formulario 29</h1>

      {/* Banner de estado bloqueado */}
      {bloqueado && (
        <div className="alert alert-info d-flex align-items-center gap-2 mb-4">
          <i className="bi bi-lock-fill fs-5"></i>
          <span>
            Este resumen está marcado como <strong>Revisado</strong> y se encuentra en modo solo lectura.
            Para editar, cámbialo a <strong>Borrador</strong> desde el dashboard.
          </span>
        </div>
      )}

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      <SeccionContribuyente resumen={resumen} />
      <SeccionDebitosVentas
        ventasDetalle={resumen.ventas_detalle}
        ventasTotal={resumen.ventas_total}
        onChange={handleVentaChange}
      />
      <SeccionCreditosCompras
        comprasDetalle={resumen.compras_detalle}
        comprasTotal={resumen.compras_total}
        IVAPP={resumen.IVAPP}
        remanente={resumen.remanente}
        onChange={handleCompraChange}
      />
      <SeccionRetencionesTotal
        remuneraciones={resumen.remuneraciones || {}}
        honorarios={resumen.honorarios || {}}
        ppm={resumen.ppm || {}}
        TT={resumen.TT || 0}
        onRemChange={handleRemChange}
        onHonChange={handleHonChange}
        onPpmChange={handlePpmChange}
      />

      <div className="card mb-4 shadow-sm border-secondary">
        <div className="card-header bg-secondary text-white">
          <h5 className="mb-0">Datos adicionales (no afectan F29)</h5>
        </div>
        <div className="card-body">
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label fw-bold">Arriendos pagados</label>
              <NumberInput
                value={resumen.arriendos_pagados || 0}
                onChange={(val) => {
                  if (!bloqueado) setResumen(prev => ({ ...prev, arriendos_pagados: val }));
                }}
                disabled={bloqueado}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Gastos generales (boletas)</label>
              <NumberInput
                value={resumen.gastos_generales_boletas || 0}
                onChange={(val) => {
                  if (!bloqueado) setResumen(prev => ({ ...prev, gastos_generales_boletas: val }));
                }}
                disabled={bloqueado}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex gap-4 justify-content-center mt-5">
        {/* Aplicar cambios — deshabilitado si bloqueado */}
        <button
          className="btn btn-primary btn-lg px-5"
          onClick={handleApplyChanges}
          disabled={loading || bloqueado}
          title={bloqueado ? 'El resumen está revisado, cambia a borrador para editar' : ''}
        >
          {loading ? 'Aplicando...' : 'Aplicar Cambios'}
        </button>

        {/* Exportar — siempre disponible */}
        <button
          className="btn btn-success btn-lg px-5"
          onClick={handleExport}
          disabled={loading}
        >
          {loading ? 'Generando...' : 'Exportar a Excel'}
        </button>

        <button
          className="btn btn-outline-secondary btn-lg px-5"
          onClick={() => navigate(-1)}
        >
          Volver
        </button>
      </div>

      {loading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
          style={{ zIndex: 9999 }}
        >
          <div className="card p-4 text-center bg-white shadow">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p>Procesando...</p>
          </div>
        </div>
      )}
    </div>
  );
}