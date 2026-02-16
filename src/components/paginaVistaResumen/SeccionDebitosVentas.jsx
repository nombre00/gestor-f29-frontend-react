// Seccion editable de la vista resumenF29.


import { formatCLP, unformatCLP } from '../../services/F29Calculator';

export default function SeccionDebitosVentas({ ventasDetalle, ventasTotal, onChange }) { // MODIFICADO: props para edición
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
              {ventasDetalle.map((det, idx) => (
                <tr key={idx}>
                  <td>{det.tipo}</td>
                  <td>{det.desc || ''}</td>
                  <td className="text-end">
                    {/* NUEVO: input editable */}
                    <input
                      type="text"
                      className="form-control form-control-sm text-end"
                      value={formatCLP(det.td || 0)}
                      onChange={(e) => onChange(idx, 'td', unformatCLP(e.target.value))}
                      onBlur={(e) => { e.target.value = formatCLP(unformatCLP(e.target.value)); }}
                    />
                  </td>
                  <td className="text-end">
                    <input
                      type="text"
                      className="form-control form-control-sm text-end"
                      value={formatCLP(det.neto || 0)}
                      onChange={(e) => onChange(idx, 'neto', unformatCLP(e.target.value))}
                      onBlur={(e) => { e.target.value = formatCLP(unformatCLP(e.target.value)); }}
                    />
                  </td>
                  <td className="text-end">
                    <input
                      type="text"
                      className="form-control form-control-sm text-end"
                      value={formatCLP(det.iva || 0)}
                      onChange={(e) => onChange(idx, 'iva', unformatCLP(e.target.value))}
                      onBlur={(e) => { e.target.value = formatCLP(unformatCLP(e.target.value)); }}
                    />
                  </td>
                </tr>
              ))}
              <tr className="table-active fw-bold">
                <td colSpan="4" className="text-end">TOTAL NETO</td>
                <td className="text-end">{formatCLP(ventasTotal.neto || 0)}</td>
                <td></td>
              </tr>
              <tr className="table-active fw-bold">
                <td colSpan="4" className="text-end">TOTAL IVA</td>
                <td className="text-end">{formatCLP(Math.max(0, ventasTotal.iva || 0))}</td>  {/** Este valor no puede ser menor que 0. */}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}