// Componente reutilizable para seleccionar archivos.

import { useState } from 'react'

export default function FileSelector({
  label,
  accept = ".xlsx,.xls,.csv,.pdf",
  onFileChange,
  initialFileName = '',
}) {
  // Variables para manejar estados.
  const [fileName, setFileName] = useState(initialFileName)
  const [status, setStatus] = useState('')

  // Función escuchadora del estado. 
  const handleChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFileName(file.name)
      setStatus('✓ Cargado')
      onFileChange(file)  // pasamos el File object real
    }
  }

  return (
    <div className="d-flex align-items-center mb-3">
      <label className="form-label me-3 mb-0" style={{ minWidth: '160px' }}>
        {label}: {/** Acá va el primer atributo del componente, la etiqueta. */}
      </label>
      
      <div className="input-group" style={{ maxWidth: '500px' }}>
        {/** Acá va el segundo atributo del componente, los tipos de archivos acceptados. */}  
        <input
          type="file"
          className="form-control"
          accept={accept}  
          onChange={handleChange}
        />  
        <span className="input-group-text bg-success text-white">
          {status || 'Seleccionar'}
        </span>
      </div>

      {fileName && (
        <small className="text-muted ms-3">
          {fileName}
        </small>
      )}
    </div>
  )
}