// Página donde se ingresan los datos y se procesan.


// Bibliotecas.
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// Componentes.
import FileSelector from '../components/FileSelector'
import NumberInput from '../components/NumberInput'
import LoadingOverlay from '../components/LoadingOverlay'
// Services.
import { procesarYObtenerResumen, generarYDescargarExcel } from '../services/GestorF29Service'  // asumiendo que lo tienes

export default function GestorF29() {
  const navigate = useNavigate()
  const [files, setFiles] = useState({})
  const [remanente, setRemanente] = useState(0)
  const [importaciones, setImportaciones] = useState({
    cant_giro: 0, monto_giro: 0, iva_giro: 0,
    cant_activo: 0, monto_activo: 0, iva_activo: 0
  })
  const [showImportaciones, setShowImportaciones] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const ready = files.ventas && files.compras && files.remuneraciones && files.honorarios
    setIsReady(ready)
  }, [files])

  const handleFileSelect = (key) => (file) => {
    setFiles(prev => ({ ...prev, [key]: file }))
    setError('')
  }

  const handleGenerar = async () => {
    setLoading(true)
    setError('')

    try {
      await generarYDescargarExcel({ files, remanente, importaciones })
      alert('Resumen generado y descargado')
    } catch (err) {
      setError(err.message || 'Error al generar Excel')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerarYVer = async () => {
    setLoading(true)
    setError('')

    try {
      const resumen = await procesarYObtenerResumen({ files, remanente, importaciones })
      navigate('/resumen', { state: { resumen } })
    } catch (err) {
      setError(err.message || 'Error al generar resumen')
    } finally {
      setLoading(false)
    }
  }

  const handleVolver = () => {
    navigate('/inicio')
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-primary">Cargar Documentos para F29</h1>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      <FileSelector label="Detalle de Ventas" onFileChange={handleFileSelect('ventas')} />
      <FileSelector label="Detalle de Compras" onFileChange={handleFileSelect('compras')} />
      <FileSelector label="Libro de Remuneraciones" onFileChange={handleFileSelect('remuneraciones')} />
      <FileSelector label="Registro de Honorarios" onFileChange={handleFileSelect('honorarios')} />

      <NumberInput label="Remanente mes anterior" value={remanente} onChange={setRemanente} />

      <button 
        className="btn btn-outline-info mt-3 mb-3"
        onClick={() => setShowImportaciones(!showImportaciones)}
      >
        {showImportaciones ? 'Ocultar Importaciones' : 'Incluir Importaciones'}
      </button>

      {showImportaciones && (
        <div className="card p-4 mb-4">
          {/* Aquí iría ImportacionesForm.jsx, por ahora placeholder */}
          <p>Formulario de importaciones (implementar con radios e inputs)</p>
        </div>
      )}

      <div className="d-flex gap-3 justify-content-center">
        <button className="btn btn-success btn-lg" onClick={handleGenerar} disabled={!isReady || loading}>
          Generar Resumen F29
        </button>

        <button className="btn btn-primary btn-lg" onClick={handleGenerarYVer} disabled={!isReady || loading}>
          Generar y Ver Resumen F29
        </button>

        <button className="btn btn-secondary btn-lg" onClick={handleVolver}>
          Volver
        </button>
      </div>

      {loading && <LoadingOverlay text="Generando resumen F29..." />}
    </div>
  )
}