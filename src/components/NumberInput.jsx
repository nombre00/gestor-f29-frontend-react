// Componente reutilizable para ingresar valores numéricos.

import { useState, useEffect } from 'react'   // Hooks.

export default function NumberInput({
  label,  // Etiqueta.
  value = 0,  // Valor inicial.
  onChange,  // variable para el escuchador.
  width = '140px',  // Dimención.
}) {
  // Escuchador de cambios que recarga la función que formatea a pesos chilenos.
  const [displayValue, setDisplayValue] = useState(value.toLocaleString('es-CL'))

  // Función que formatea a pesos chilenos.
  // useEffect: es el código que se ejecuta despues que la variable se vuelve a renderear, sería un efecto secundario.
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