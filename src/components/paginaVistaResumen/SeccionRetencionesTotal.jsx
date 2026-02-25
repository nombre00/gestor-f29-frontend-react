// Sección de la vista resumenF29.


import { formatCLP, unformatCLP } from '../../services/F29Calculator';

export default function SeccionRetencionesTotal({
  remuneraciones,
  honorarios,
  ppm,
  TT,
  onRemChange,
  onHonChange,
  onPpmChange,
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
                <td className="text-end">
                  <input
                    type="text"
                    className="form-control form-control-sm text-end"
                    value={formatCLP(remuneraciones.th_remuneraciones || 0)}
                    onChange={(e) => onRemChange('th_remuneraciones', unformatCLP(e.target.value))}
                    onBlur={(e) => (e.target.value = formatCLP(unformatCLP(e.target.value)))}
                  />
                </td>
                <td className="text-end">
                  <input
                    type="text"
                    className="form-control form-control-sm text-end"
                    value={formatCLP(remuneraciones.impt_unico || 0)}
                    onChange={(e) => onRemChange('impt_unico', unformatCLP(e.target.value))}
                    onBlur={(e) => (e.target.value = formatCLP(unformatCLP(e.target.value)))}
                  />
                </td>
              </tr>

              {/* Retención Honorarios */}
              <tr>
                <td>Retención Honorarios</td>
                <td className="text-end">
                  <input
                    type="text"
                    className="form-control form-control-sm text-end"
                    value={formatCLP(honorarios.honorarios || 0)}
                    onChange={(e) => onHonChange('honorarios', unformatCLP(e.target.value))}
                    onBlur={(e) => (e.target.value = formatCLP(unformatCLP(e.target.value)))}
                  />
                </td>
                <td className="text-end">
                  <input
                    type="text"
                    className="form-control form-control-sm text-end"
                    value={formatCLP(honorarios.retencion || 0)}
                    onChange={(e) => onHonChange('retencion', unformatCLP(e.target.value))}
                    onBlur={(e) => (e.target.value = formatCLP(unformatCLP(e.target.value)))}
                  />
                </td>
              </tr>

              {/* Retención 3% (remuneraciones) */}
              <tr>
                <td>Retención 3% (remuneraciones)</td>
                <td className="text-end">
                  <input
                    type="text"
                    className="form-control form-control-sm text-end"
                    value={formatCLP(remuneraciones.base_rem_3porc || 0)}
                    onChange={(e) => onRemChange('base_rem_3porc', unformatCLP(e.target.value))}
                    onBlur={(e) => (e.target.value = formatCLP(unformatCLP(e.target.value)))}
                  />
                </td>
                <td className="text-end">
                  <input
                    type="text"
                    className="form-control form-control-sm text-end"
                    value={formatCLP(remuneraciones.rem_3porc || 0)}
                    onChange={(e) => onRemChange('rem_3porc', unformatCLP(e.target.value))}
                    onBlur={(e) => (e.target.value = formatCLP(unformatCLP(e.target.value)))}
                  />
                </td>
              </tr>

              {/* Retención 3% (honorarios) – solo valor */}
              <tr>
                <td>Retención 3% (honorarios)</td>
                <td colSpan="2" className="text-end">
                  <input
                    type="text"
                    className="form-control form-control-sm text-end"
                    value={formatCLP(honorarios.cod155 || 0)}
                    onChange={(e) => onHonChange('cod155', unformatCLP(e.target.value))}
                    onBlur={(e) => (e.target.value = formatCLP(unformatCLP(e.target.value)))}
                  />
                </td>
              </tr>

              {/* PPM 1° Categoría */}
              <tr>
              <td>PPM 1° Categoría</td>
              <td className="text-end">
                <input
                  type="text"
                  className="form-control form-control-sm text-end"
                  value={formatCLP(ppm.base || 0)}
                  onChange={(e) => onPpmChange('base', unformatCLP(e.target.value))}
                  onBlur={(e) => (e.target.value = formatCLP(unformatCLP(e.target.value)))}
                />
              </td>
              <td className="text-end">
                <div className="d-flex align-items-center justify-content-between w-100">
                  {/* Tasa - a la izquierda */}
                  <div className="input-group input-group-sm" style={{ width: '110px' }}>
                    <input
                      type="text"
                      className="form-control text-end"
                      value={ppm.tasa ?? ''}  // ← permite vacío mientras se escribe
                      placeholder="0.2"
                      onChange={(e) => {
                        // Solo limpiamos caracteres inválidos, no convertimos aún
                        const raw = e.target.value.replace(/[^0-9.]/g, '');
                        onPpmChange('tasa', raw);  // ← guardamos string temporal
                      }}
                      onBlur={(e) => {
                        let val = parseFloat(e.target.value);
                        if (isNaN(val) || val < 0) val = 0.2;  // Default si vacío o inválido
                        onPpmChange('tasa', val);
                        e.target.value = val.toFixed(2);  // Muestra siempre 2 decimales
                      }}
                    />
                    <span className="input-group-text">%</span>
                  </div>

                  {/* Valor calculado */}
                  <span className="fw-bold text-primary ms-auto">
                    {formatCLP(ppm.ppm || 0)}
                  </span>
                </div>
              </td>
            </tr>

              {/* PPM segunda categoría */}
              <tr>
                <td>PPM segunda categoría</td>
                <td className="text-end">
                  <input
                    type="text"
                    className="form-control form-control-sm text-end"
                    value={formatCLP(ppm.PPM2_base || 0)}
                    onChange={(e) => onPpmChange('PPM2_base', unformatCLP(e.target.value))}
                    onBlur={(e) => (e.target.value = formatCLP(unformatCLP(e.target.value)))}
                  />
                </td>
                <td className="text-end">
                  <input
                    type="text"
                    className="form-control form-control-sm text-end"
                    value={formatCLP(ppm.PPM2_valor || 0)}
                    onChange={(e) => onPpmChange('PPM2_valor', unformatCLP(e.target.value))}
                    onBlur={(e) => (e.target.value = formatCLP(unformatCLP(e.target.value)))}
                  />
                </td>
              </tr>

              {/* PPM transportista */}
              <tr>
                <td>PPM transportista</td>
                <td className="text-end">
                  <input
                    type="text"
                    className="form-control form-control-sm text-end"
                    value={formatCLP(ppm.PPM_transportista_base || 0)}
                    onChange={(e) => onPpmChange('PPM_transportista_base', unformatCLP(e.target.value))}
                    onBlur={(e) => (e.target.value = formatCLP(unformatCLP(e.target.value)))}
                  />
                </td>
                <td className="text-end">
                  <input
                    type="text"
                    className="form-control form-control-sm text-end"
                    value={formatCLP(ppm.PPM_transportista_valor || 0)}
                    onChange={(e) => onPpmChange('PPM_transportista_valor', unformatCLP(e.target.value))}
                    onBlur={(e) => (e.target.value = formatCLP(unformatCLP(e.target.value)))}
                  />
                </td>
              </tr>

              {/* TOTAL A PAGAR – no editable */}
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