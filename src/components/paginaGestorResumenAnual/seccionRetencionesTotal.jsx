// components/paginaVistaResumen/SeccionRetencionesTotalReadOnly.jsx
import { formatCLP } from '../../services/F29Calculator';

export default function SeccionRetencionesTotal({
  remuneraciones,
  honorarios,
  ppm,
  TT,
}) {
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
              {/* Impuesto Único (remuneraciones) */}
              <tr>
                <td>Impuesto Único (remuneraciones)</td>
                <td className="text-end">{formatCLP(remuneraciones.th_remuneraciones || 0)}</td>
                <td className="text-end">{formatCLP(remuneraciones.impt_unico || 0)}</td>
              </tr>

              {/* Retención Honorarios */}
              <tr>
                <td>Retención Honorarios</td>
                <td className="text-end">{formatCLP(honorarios.honorarios || 0)}</td>
                <td className="text-end">{formatCLP(honorarios.retencion || 0)}</td>
              </tr>

              {/* Retención 3% (remuneraciones) */}
              <tr>
                <td>Retención 3% (remuneraciones)</td>
                <td className="text-end">{formatCLP(remuneraciones.base_rem_3porc || 0)}</td>
                <td className="text-end">{formatCLP(remuneraciones.rem_3porc || 0)}</td>
              </tr>

              {/* Retención 3% (honorarios) */}
              <tr>
                <td>Retención 3% (honorarios)</td>
                <td colSpan="2" className="text-end">{formatCLP(honorarios.cod155 || 0)}</td>
              </tr>

              {/* PPM 1° Categoría */}
              <tr>
                <td>PPM 1° Categoría</td>
                <td className="text-end">{formatCLP(ppm.base || 0)}</td>
                <td className="text-end">
                  <span className="fw-bold text-primary">
                    {formatCLP(ppm.ppm || 0)}
                  </span>
                </td>
              </tr>

              {/* PPM segunda categoría */}
              <tr>
                <td>PPM segunda categoría</td>
                <td className="text-end">{formatCLP(ppm.PPM2_base || 0)}</td>
                <td className="text-end">{formatCLP(ppm.PPM2_valor || 0)}</td>
              </tr>

              {/* PPM transportista */}
              <tr>
                <td>PPM transportista</td>
                <td className="text-end">{formatCLP(ppm.PPM_transportista_base || 0)}</td>
                <td className="text-end">{formatCLP(ppm.PPM_transportista_valor || 0)}</td>
              </tr>

              {/* TOTAL A PAGAR */}
              <tr className="table-active fw-bold">
                <td colSpan="2" className="text-end">TOTAL A PAGAR</td>
                <td className="text-end">{formatCLP(TT || 0)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}