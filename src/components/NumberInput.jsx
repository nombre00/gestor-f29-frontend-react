// Componente reutilizable para ingresar valores numéricos.

import { useState, useEffect } from 'react'

export default function NumberInput({
  label,
  value = 0,
  onChange,
  width = '140px',
}) {
  const [displayValue, setDisplayValue] = useState(value.toLocaleString('es-CL'))

  useEffect(() => {
    setDisplayValue(value.toLocaleString('es-CL'))
  }, [value])

  const handleChange = (e) => {
    const raw = e.target.value.replace(/\./g, '')
    const num = parseInt(raw, 10) || 0
    onChange(num)
    setDisplayValue(num.toLocaleString('es-CL'))
  }

  return (
    <div className="d-flex align-items-center mb-2">
      {label && <label className="form-label me-3 mb-0" style={{ minWidth: '160px' }}>{label}:</label>}
      <input
        type="text"
        className="form-control text-end"
        style={{ width }}
        value={displayValue}
        onChange={handleChange}
      />
    </div>
  )
}