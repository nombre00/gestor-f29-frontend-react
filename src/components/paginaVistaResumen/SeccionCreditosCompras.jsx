// Sección editable de la vista resumenf29.


// Módulos.
import { formatCLP, unformatCLP } from '../../services/F29Calculator';  // Importamos la función que formatéa los valores.


// Recibe como parámetros los diccionarios del ResumenF29, el remanente y una función escuchadora propia para re-renderizar cuando el usuario edita un valor.
export default function SeccionCreditosCompras({ comprasDetalle, comprasTotal, IVAPP, remanente, onChange }) {
  return (
    <div className="card mb-4 shadow-sm border-success">  {/** div contenedor del componente. */}
      <div className="card-header bg-success text-white">  {/** div header del componente. */}
        <h5 className="mb-0">CRÉDITOS Y COMPRAS</h5>  {/** Texto del header. */}
      </div>
      <div className="card-body p-0">  {/** div contenedor de la tabla. */}
        <div className="table-responsive">  {/** div contenedor que hace la tabla scroleable en móbiles. */}
          <table className="table table-bordered table-sm mb-0">  {/** div contenedor del header y filas de la tabla. */}
            <thead className="table-light">  {/** header de la tabla */}
              <tr>  {/** Indica que son casillas de esta fila que es el header. */}
                <th>Código</th>  {/** Encabezado. */}
                <th>Descripción</th>  {/** Encabezado. */}
                <th className="text-end">T.D</th>  {/** Encabezado. */}
                <th className="text-end">Monto Neto</th>  {/** Encabezado. */}
                <th className="text-end">Crédito Recuperable</th>  {/** Encabezado. */}
              </tr>
            </thead>  {/** Cerramos el header. */}
            <tbody>   {/** Cuerpo de la tabla. */}
              {/** Acá empezamos la iteración de las filas. */}
              {/** det: el objeto   |   idx: el índice, en este caso el índice es la llave de un tuple. */}
              {comprasDetalle.map((det, idx) => (
                <tr key={idx}>  {/** Por cada objeto creamos una fila. */}
                  <td>{det.tipo}</td>  {/** valor */}
                  <td>{det.desc || ''}</td>  {/** valor */}
                  <td className="text-end"> {/** casilla editable TOTAL DOCUMENTOS. */}
                    {/** input permite ingresar valores, y tiene la función escuchadora de cambios para re-renderear y la función formateadora. */}
                    <input
                      type="text"
                      className="form-control form-control-sm text-end"
                      value={formatCLP(det.td || 0)} // Muestra valor formateado cuando renderiza por primera vez.
                      onChange={(e) => onChange(idx, 'td', unformatCLP(e.target.value))}  // Escuchador de cambios para re-renderear.
                      onBlur={(e) => { e.target.value = formatCLP(unformatCLP(e.target.value)); }}  // Escuchador cuando salimos del campo para re-renderear.
                    />
                  </td>
                  <td className="text-end"> {/** casilla editable VALOR NETO. */}
                    <input
                      type="text"
                      className="form-control form-control-sm text-end"
                      value={formatCLP(det.neto || 0)} // Muestra valor formateado cuando renderiza por primera vez.
                      onChange={(e) => onChange(idx, 'neto', unformatCLP(e.target.value))}  // Escuchador de cambios para re-renderear.
                      onBlur={(e) => { e.target.value = formatCLP(unformatCLP(e.target.value)); }}  // Escuchador cuando salimos del campo para re-renderear.
                    />
                  </td>
                  <td className="text-end"> {/** casilla editable IVA. */}
                    <input
                      type="text"
                      className="form-control form-control-sm text-end"
                      value={formatCLP(det.iva_rec || 0)} // Muestra valor formateado cuando renderiza por primera vez.
                      onChange={(e) => onChange(idx, 'iva_rec', unformatCLP(e.target.value))}  // Escuchador de cambios para re-renderear.
                      onBlur={(e) => { e.target.value = formatCLP(unformatCLP(e.target.value)); }}  // Escuchador cuando salimos del campo para re-renderear.
                    />
                  </td>
                </tr>  // fin de la fila.
              ))}   {/** Fin de las iteraciones. */}
              {/** Totales que se calculan. */}
              <tr className="table-active fw-bold">  {/** fila */}
                <td colSpan="3" className="text-end">TOTAL NETO</td>  {/** Título de la fila, esta celda ocupa 3 columnas (colspan='3'). */}
                <td className="text-end">{formatCLP(comprasTotal.neto || 0)}</td>  {/** valor en la siguiente celda de la fila. */}
                <td className="text-end">{formatCLP(Math.max(0, comprasTotal.iva_rec || 0))}</td> {/**Valor, forzamos un 0 acá, no permite valores negativos. */}
                <td></td>
              </tr>
              <tr className="table-active fw-bold">  {/** fila */}
                <td colSpan="4" className="text-end">IVA POR PAGAR</td>  {/** Título de la fila, esta celda ocupa 4 columnas (colspan='4'). */}
                <td className="text-end">{formatCLP(IVAPP || 0)}</td>  {/** valor en la siguiente celda de la fila. */}
              </tr>
              <tr className="table-active fw-bold">  {/** fila */}
                <td colSpan="4" className="text-end">REMANENTE</td>  {/** Título de la fila, esta celda ocupa 4 columnas (colspan='4'). */}
                <td className="text-end">{formatCLP(remanente || 0)}</td>  {/** valor en la siguiente celda de la fila. */}
              </tr>
            </tbody>  {/** Fin del cuerpo de la tabla. */}
          </table>  {/** Fin de la tabla. */}
        </div>  {/** Fin del contenedor que permite escrolear. */}
      </div>  {/** Fin del div contenedor de la tabla. */}
    </div>  // Fin del div contenedor del componente.
  );
}