// Sección de la vista resumenF29.


import { formatCLP } from '../services/F29Calculator'

export default function SeccionRetencionesTotal({ resumen }) {
  const rem = resumen.remuneraciones || {}
  const hon = resumen.honorarios || {}
  const ppm = resumen.ppm || {}

  return (
    <div className="card mb-4 shadow-sm border-warning">
      <div className="card-header bg-warning text-dark">
        <h5 className="mb-0">RETENCIONES Y TOTAL</h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered table-sm">
            <thead className="table-light">
              <tr>
                <th>Concepto</th>
                <th className="text-end">Base</th>
                <th className="text-end">Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Impuesto Único (remuneraciones)</td>
                <td className="text-end">{formatCLP(rem.th_remuneraciones || 0)}</td>
                <td className="text-end">{formatCLP(rem.impt_unico || 0)}</td>
              </tr>
              <tr>
                <td>Retención Honorarios</td>
                <td className="text-end">{formatCLP(hon.honorarios || 0)}</td>
                <td className="text-end">{formatCLP(hon.retencion || 0)}</td>
              </tr>
              <tr>
                <td>Retención 3% (remuneraciones)</td>
                <td className="text-end">{formatCLP(rem.base_rem_3porc || 0)}</td>
                <td className="text-end">{formatCLP(rem.rem_3porc || 0)}</td>
              </tr>
              <tr>
                <td>Retención 3% (honorarios)</td>
                <td colSpan="2" className="text-end">{formatCLP(hon.cod155 || 0)}</td>
              </tr>
              <tr>
                <td>PPM 1° Categoría</td>
                <td className="text-end">{formatCLP(ppm.base || 0)}</td>
                <td className="text-end">{formatCLP(ppm.ppm || 0)}</td>
              </tr>
              <tr>
                <td>PPM segunda categoría</td>
                <td className="text-end">{formatCLP(ppm.PPM2_base || 0)}</td>
                <td className="text-end">{formatCLP(ppm.PPM2_valor || 0)}</td>
              </tr>
              <tr>
                <td>PPM transportista</td>
                <td className="text-end">{formatCLP(ppm.PPM_transportista_base || 0)}</td>
                <td className="text-end">{formatCLP(ppm.PPM_transportista_valor || 0)}</td>
              </tr>
              <tr className="table-active fw-bold">
                <td colSpan="2" className="text-end">TOTAL A PAGAR</td>
                <td className="text-end">{formatCLP(resumen.TT || 0)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}