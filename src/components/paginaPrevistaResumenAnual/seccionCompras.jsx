// components/paginaVistaResumen/SeccionCreditosComprasReadOnly.jsx
import { formatCLP } from '../../services/F29Calculator';

export default function SeccionCompras({
  comprasDetalle,
  comprasTotal,
  IVAPP,
  remanente,
}) {
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
                <th>Código</th>
                <th>Descripción</th>
                <th className="text-end">T.D</th>
                <th className="text-end">Monto Neto</th>
                <th className="text-end">Crédito Recuperable</th>
              </tr>
            </thead>
            <tbody>
              {comprasDetalle.map((det, idx) => (
                <tr key={idx}>
                  <td>{det.tipo}</td>
                  <td>{det.desc || ''}</td>
                  <td className="text-end">{formatCLP(det.td || 0)}</td>
                  <td className="text-end">{formatCLP(det.neto || 0)}</td>
                  <td className="text-end">{formatCLP(det.iva_rec || 0)}</td>
                </tr>
              ))}
              <tr className="table-active fw-bold">
                <td colSpan="3" className="text-end">TOTAL NETO</td>
                <td className="text-end">{formatCLP(comprasTotal.neto || 0)}</td>
                <td className="text-end">{formatCLP(Math.max(0, comprasTotal.iva_rec || 0))}</td>
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