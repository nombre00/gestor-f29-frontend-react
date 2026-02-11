// Acá se puede previsualizar y editar el resumen antes de exportarlo.


// src/pages/ResumenF29.jsx
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
// Componentes
import SeccionContribuyente from '../components/SeccionContribuyente'
import SeccionDebitosVentas from '../components/SeccionDebitosVentas'
import SeccionCreditosCompras from '../components/SeccionCreditosCompras'
import SeccionRetencionesTotal from '../components/SeccionRetencionesTotal'
// Services
import { recalcularResumen } from '../services/F29Calculator'
import { exportarResumenAExcel } from '../services/VistaResumenF29Service'  // ← NUEVO

export default function ResumenF29() {
  const location = useLocation()
  const navigate = useNavigate()
  const [resumen, setResumen] = useState(location.state?.resumen || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!resumen) {
      setError('No se recibieron datos de resumen. Vuelve a cargar documentos.')
    }
  }, [resumen])

  const handleApplyChanges = () => {
    setLoading(true)
    try {
      const updated = recalcularResumen({ ...resumen })
      setResumen(updated)
      alert('Cambios aplicados y totales recalculados')
    } catch (err) {
      setError('Error al recalcular: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    if (!resumen) return

    setLoading(true)
    setError('')

    try {
      await exportarResumenAExcel(resumen)  // ← llamada limpia al service
      alert('Excel generado y descargado correctamente')
    } catch (err) {
      setError(err.message || 'Error al exportar el resumen')
    } finally {
      setLoading(false)
    }
  }

  if (!resumen) {
    return (
      <div className="container py-5 text-center">
        <h2 className="text-danger">No hay datos disponibles</h2>
        <button 
          className="btn btn-primary mt-3" 
          onClick={() => navigate('/gestor')}
        >
          Volver a Gestor F29
        </button>
      </div>
    )
  }

  return (
    <div className="container py-5 position-relative">
      <h1 className="mb-5 text-primary text-center">Resumen Formulario 29</h1>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      <SeccionContribuyente resumen={resumen} />
      <SeccionDebitosVentas resumen={resumen} />
      <SeccionCreditosCompras resumen={resumen} />
      <SeccionRetencionesTotal resumen={resumen} />

      <div className="d-flex gap-4 justify-content-center mt-5">
        <button 
          className="btn btn-primary btn-lg px-5" 
          onClick={handleApplyChanges}
          disabled={loading}
        >
          {loading ? 'Aplicando...' : 'Aplicar Cambios'}
        </button>

        <button 
          className="btn btn-success btn-lg px-5" 
          onClick={handleExport}
          disabled={loading}
        >
          {loading ? 'Generando...' : 'Exportar a Excel'}
        </button>

        <button 
          className="btn btn-outline-secondary btn-lg px-5" 
          onClick={() => navigate('/gestor')}
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
            <p>Generando Excel...</p>
          </div>
        </div>
      )}
    </div>
  )
}