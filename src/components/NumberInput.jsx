// Componente reutilizable para ingresar valores numéricos.
// El código formatea 3 veces el número para evitar parpadeos, es la buena práctica.

import { useState, useEffect } from 'react'   // Hooks.

export default function NumberInput({
  label,  // Etiqueta.
  value = 0,  // Valor inicial.
  onChange,  // variable para el escuchador.
  width = '140px',  // Dimención.
}) {
  // Escuchador de cambios que recarga la función que formatea a pesos chilenos.
  const [displayValue, setDisplayValue] = useState(value.toLocaleString('es-CL'))  // Primer formateo

  // Función que formatea a pesos chilenos.
  // useEffect: es el código que se ejecuta despues que la variable se vuelve a renderear, sería un efecto secundario.
  useEffect(() => {  // Segundo formateo
    setDisplayValue(value.toLocaleString('es-CL'))  // Formateamos.
  }, [value])

  const handleChange = (e) => {  // Función escuchadora del re-rendereo de la variable.
    const raw = e.target.value.replace(/\./g, '')  // Tercer formateo
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