// Sección de la vista resumenf29.


export default function SeccionContribuyente({ resumen }) {  // Recibe resumen como parámetro.
  const enc = resumen.encabezado || {}  // Tomamos el encabezado y lo guardamos en una variable.

  return (
    <div className="card mb-4 shadow-sm border-primary"> {/** primer div es asignado como la 'card' o contenedor principal. */}
      <div className="card-header bg-primary text-white"> {/** Encabezado de la card. */}
        <h5 className="mb-0">RESUMEN FORMULARIO 29 - CONTRIBUYENTE</h5> {/** Texto del encabezado. */}
      </div>
      <div className="card-body"> {/** Card del cuerpo de la card. */}
        <div className="row g-3">  {/** fila de encabezado de columnas. */}
          <div className="col-md-4 fw-bold">Contribuyente:</div>  {/** header de la columna */}
          <div className="col-md-8">{enc.nombre || '-'}</div>  {/** Valor de la columnas */}

          <div className="col-md-4 fw-bold">RUT:</div>  {/** header de la columna */}
          <div className="col-md-8">{enc.rut || '-'}</div>  {/** Valor de la columnas */}

          <div className="col-md-4 fw-bold">N°:</div>  {/** header de la columna */}
          <div className="col-md-8">{enc.numero || '-'}</div>  {/** Valor de la columnas */}

          <div className="col-md-4 fw-bold">Clave SII:</div>  {/** header de la columna */}
          <div className="col-md-8">{enc.clave_sii || '-'}</div>  {/** Valor de la columnas */}

          <div className="col-md-4 fw-bold">Período:</div>  {/** header de la columna */}
          <div className="col-md-8">  {/** Div para agrupar 2 valores en una fila. */}
            {enc.periodo_mes || ''} {enc.periodo_anio || ''}  {/** Valores de la columnas */}
          </div>
        </div>
      </div>
    </div>
  )
}