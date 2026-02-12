// Sección editable de la vista resumenf29.


import { formatCLP, unformatCLP } from '../services/F29Calculator';

export default function SeccionCreditosCompras({ comprasDetalle, comprasTotal, IVAPP, remanente, onChange }) {
  return (
    <div className="card mb-4 shadow-sm border-success">
      <div className="card-header bg-success text-white">
        <h5 className="mb-0">CRÉDITOS Y COMPRAS</h5>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-bordered table-sm mb-0">
            <thead className="table-light">
              <tr>
                <th>Tipo</th> {/** Encabezados. */}
                <th>Descripción</th>
                <th className="text-end">T.D</th>
                <th className="text-end">Monto Neto</th>
                <th className="text-end">Crédito Recuperable</th>
              </tr>
            </thead>
            <tbody>   {/** Acá empezamos la iteración de las filas. */}
              {comprasDetalle.map((det, idx) => (  
                <tr key={idx}>
                  <td>{det.tipo}</td>
                  <td>{det.desc || ''}</td>
                  <td className="text-end"> {/** Total documentos */}
                    <input
                      type="text"
                      className="form-control form-control-sm text-end"
                      value={formatCLP(det.td || 0)}
                      onChange={(e) => onChange(idx, 'td', unformatCLP(e.target.value))}
                      onBlur={(e) => { e.target.value = formatCLP(unformatCLP(e.target.value)); }}
                    />
                  </td>
                  <td className="text-end"> {/** Valor neto. */}
                    <input
                      type="text"
                      className="form-control form-control-sm text-end"
                      value={formatCLP(det.neto || 0)}
                      onChange={(e) => onChange(idx, 'neto', unformatCLP(e.target.value))}
                      onBlur={(e) => { e.target.value = formatCLP(unformatCLP(e.target.value)); }}
                    />
                  </td>
                  <td className="text-end"> {/** IVA. */}
                    <input
                      type="text"
                      className="form-control form-control-sm text-end"
                      value={formatCLP(det.iva_rec || 0)}
                      onChange={(e) => onChange(idx, 'iva_rec', unformatCLP(e.target.value))}
                      onBlur={(e) => { e.target.value = formatCLP(unformatCLP(e.target.value)); }}
                    />
                  </td>
                </tr>
              ))}
              {/** Totales que se calculan. */}
              <tr className="table-active fw-bold">
                <td colSpan="3" className="text-end">TOTAL NETO</td>
                <td className="text-end">{formatCLP(comprasTotal.neto || 0)}</td>
                <td className="text-end">{formatCLP(Math.max(0, comprasTotal.iva_rec || 0))}</td> {/** forzamos un 0 acá, no permite valores negativos. */}
                <td></td>
              </tr>
              <tr className="table-active fw-bold">
                <td colSpan="4" className="text-end">IVA POR PAGAR</td>
                <td className="text-end">{formatCLP(IVAPP || 0)}</td>
              </tr>
              <tr className="table-active fw-bold">
                <td colSpan="4" className="text-end">REMANENTE</td>
                <td className="text-end">{formatCLP(remanente || 0)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}