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
  const navigate = useNavigate()  // Para navegar a otras vistas.
  const [files, setFiles] = useState({})  // Para los archivos, hay que editar para recibirlos uno a uno
  const [remanente, setRemanente] = useState(0)  // Para el remanente.
  const [importaciones, setImportaciones] = useState({  // Para las importaciones.
    cant_giro: 0, monto_giro: 0, iva_giro: 0,
    cant_activo: 0, monto_activo: 0, iva_activo: 0
  })
  const [showImportaciones, setShowImportaciones] = useState(false)  // Para mostrar o no el menu de input de importaciones.
  const [loading, setLoading] = useState(false)  // Para el spiner mientras se espera.
  const [error, setError] = useState('')
  const [isReady, setIsReady] = useState(false)  // Para habilitar los botones una vez se ingresaron los archivos.

  useEffect(() => {  // Función que escucha si se ingresaron los 4 archivos para habilitar los bottones generar y generar y ver.
  const ready =  // !! convierte la pregunta a booleano, hace la pregunta menos sensible y por lo mismo menos proclive a errores.
    !!files.archivo_ventas &&
    !!files.archivo_compras &&
    !!files.archivo_remuneraciones &&
    !!files.archivo_honorarios;
  setIsReady(ready);
}, [files]);

  // Función que selecciona los archivos retornados por el componente y los guarda como tuples en el diccionario 'files'.
  const handleFileSelect = (key) => (file) => {  
    setFiles(prev => ({ ...prev, [key]: file }))
    setError('')
  }

  // Función del botón generar
  const handleGenerar = async () => {  // Función asíncrona.
    setLoading(true)
    setError('')
    try {
      await generarYDescargarExcel({ files, remanente, importaciones })  // LLamamos a la función del service.
      alert('Resumen generado y descargado')
    } catch (err) {
      setError(err.message || 'Error al generar Excel')
    } finally {
      setLoading(false)
    }
  }

  // Función del botón generar y ver.
  const handleGenerarYVer = async () => {  // Función asíncrona.
    setLoading(true)
    setError('')
    try {
      const resumen = await procesarYObtenerResumen({ files, remanente, importaciones })  // LLamamos a la función del service.
      navigate('/resumen', { state: { resumen } })  // Acá le pasamos el resumen como un estado a la página siguiente.
    } catch (err) {
      setError(err.message || 'Error al generar resumen')
    } finally {
      setLoading(false)
    }
  }

  // Función del botón volver.
  const handleVolver = () => {
    navigate('/inicio')  // Nos enruta al inicio.
  }

  return (
    <div className="container py-5">
      {/** Encabezado. */}
      <h1 className="mb-4 text-primary">Cargar Documentos para F29</h1>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      {/** Componentes para seleccionar los archivos. */}
      <FileSelector label="Detalle de Ventas" onFileChange={handleFileSelect('archivo_ventas')} />
      <FileSelector label="Detalle de Compras" onFileChange={handleFileSelect('archivo_compras')} />
      <FileSelector label="Libro de Remuneraciones" onFileChange={handleFileSelect('archivo_remuneraciones')} />
      <FileSelector label="Registro de Honorarios" onFileChange={handleFileSelect('archivo_honorarios')} />

      {/** componente para ingresar el remanente. */}
      <NumberInput label="Remanente mes anterior" value={remanente} onChange={setRemanente} />

      {/** Botón para mostrar el componente para ingresar las importaciones. */}
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

      {/** Sección de los botones: generar, generar y ver y volver. */}
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