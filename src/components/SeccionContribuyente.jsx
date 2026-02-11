// Sección de la vista resumenf29.


export default function SeccionContribuyente({ resumen }) {
  const enc = resumen.encabezado || {}

  return (
    <div className="card mb-4 shadow-sm border-primary">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">RESUMEN FORMULARIO 29 - CONTRIBUYENTE</h5>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-4 fw-bold">Contribuyente:</div>
          <div className="col-md-8">{enc.nombre || '-'}</div>

          <div className="col-md-4 fw-bold">RUT:</div>
          <div className="col-md-8">{enc.rut || '-'}</div>

          <div className="col-md-4 fw-bold">N°:</div>
          <div className="col-md-8">{enc.numero || '-'}</div>

          <div className="col-md-4 fw-bold">Clave SII:</div>
          <div className="col-md-8">{enc.clave_sii || '-'}</div>

          <div className="col-md-4 fw-bold">Período:</div>
          <div className="col-md-8">
            {enc.periodo_mes || ''} {enc.periodo_anio || ''}
          </div>
        </div>
      </div>
    </div>
  )
}