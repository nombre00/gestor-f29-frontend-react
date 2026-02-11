// Seccion de la vista resumenF29.


import { formatCLP } from '../services/F29Calculator'  // asumiendo que ya lo tienes

export default function SeccionDebitosVentas({ resumen }) {
  const detalle = resumen.ventas_detalle || []
  const total = resumen.ventas_total || {}

  return (
    <div className="card mb-4 shadow-sm border-info">
      <div className="card-header bg-info text-white">
        <h5 className="mb-0">DÉBITOS Y VENTAS</h5>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-bordered table-sm mb-0">
            <thead className="table-light">
              <tr>
                <th>Tipo</th>
                <th>Descripción</th>
                <th className="text-end">T.D</th>
                <th className="text-end">Monto Neto</th>
                <th className="text-end">IVA</th>
              </tr>
            </thead>
            <tbody>
              {detalle.map((det, idx) => (
                <tr key={idx}>
                  <td>{det.tipo}</td>
                  <td>{det.desc || ''}</td>
                  <td className="text-end">{det.td || 0}</td>
                  <td className="text-end">{formatCLP(det.neto || 0)}</td>
                  <td className="text-end">{formatCLP(det.iva || 0)}</td>
                </tr>
              ))}
              <tr className="table-active fw-bold">
                <td colSpan="3" className="text-end">TOTAL NETO</td>
                <td className="text-end">{formatCLP(total.neto || 0)}</td>
                <td></td>
              </tr>
              <tr className="table-active fw-bold">
                <td colSpan="4" className="text-end">TOTAL IVA</td>
                <td className="text-end">{formatCLP(total.iva || 0)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}