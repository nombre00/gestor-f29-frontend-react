// Acá se puede previsualizar y editar el resumen antes de exportarlo.



// Bibliotecas.
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Componentes
import SeccionContribuyente from '../components/SeccionContribuyente';
import SeccionDebitosVentas from '../components/SeccionDebitosVentas';
import SeccionCreditosCompras from '../components/SeccionCreditosCompras';
import SeccionRetencionesTotal from '../components/SeccionRetencionesTotal';
// Services
import { recalcularResumen } from '../services/F29Calculator';
import { exportarResumenAExcel } from '../services/VistaResumenF29Service';


export default function ResumenF29() {
  // Variables para las funciones escuchadoras.
  const location = useLocation();  // Se usa para recibir datos de la página anterior (el resumen).
  const navigate = useNavigate();  // Para navegar entre páginas.
  const initialResumen = location.state?.resumen || null;  // Busca el resumen en la página anterior como estado, por eso: .state.
  const [resumen, setResumen] = useState(null);  // Resumen.
  const [loading, setLoading] = useState(false);  // Estado de carga para el spiner de espera.
  const [error, setError] = useState('');  // Error.

  // Función que se carga al cargar la página, hace una copia, no puntero, del resumen y trabajamos con eso.
  useEffect(() => {
    if (initialResumen) {  // Si existe el resumen:
      setResumen(JSON.parse(JSON.stringify(initialResumen))); // deep copy seguro.
    } else {  // Si no
      setError('No se recibieron datos de resumen. Vuelve a cargar documentos.');
    }
  }, [initialResumen]);

  // Función escuchadora de cambios en el componente detalle ventas.
  const handleVentaChange = (index, field, value) => {
    setResumen((prev) => {
      const updated = [...prev.ventas_detalle];  // Copia el arreglo.
      updated[index] = { ...updated[index], [field]: value };  // Actualiza el componente.
      return { ...prev, ventas_detalle: updated };  // Lo retorna como nuevo estado, lo que gatilla la re-renderización.
    });
  };

  // Función escuchadora de cambios en el componente detalle compras.
  const handleCompraChange = (index, field, value) => {
    setResumen((prev) => {  // Acá decimos: estado previo del hook resumen (porque usamos el setResumen).
      const updated = [...prev.compras_detalle];  // Copia el arreglo.
      updated[index] = { ...updated[index], [field]: value };  // Actualiza el componente.
      return { ...prev, compras_detalle: updated };  // Lo retorna como nuevo estado, lo que gatilla la re-renderización.
    });
  };

  // Funciones escuchadoras del componente retenciones totales.
  // Función escuchadora de cambios en las remuneraciones.
  const handleRemChange = (field, value) => {  // recibe de parámetros la llave de la variable a editar y el valor ingresado.
    setResumen((prev) => ({ // Acá decimos: estado actual del hook resumen (porque usamos el setResumen).
      ...prev,  // es el operador del spread, copia todas las propiedades del objeto (atributos del objeto).
      // solo actualiza remuneraciones: remuneraciones (version actual) = (prev (version actual) + [field]: value (edición)) <- sería la versión editada.
      remuneraciones: { ...prev.remuneraciones, [field]: value },
    }));
  };
  // Función escuchadora de cambios en los honorarios.
  const handleHonChange = (field, value) => { // recibe de parámetros la llave de la variable a editar y el valor ingresado.
    setResumen((prev) => ({ // Acá decimos: estado previo del hook resumen (porque usamos el setResumen).
      ...prev,  // es el operador del spread, copia todas las propiedades del objeto (atributos del objeto).
      // solo actualiza remuneraciones: remuneraciones (version actual) = (prev (version actual) + [field]: value (edición)) <- sería la versión editada.
      honorarios: { ...prev.honorarios, [field]: value },
    }));
  };
  // Función escuchadora de cambios los ppms.
  const handlePpmChange = (field, value) => { // recibe de parámetros la llave de la variable a editar y el valor ingresado.
    setResumen((prev) => ({ // Acá decimos: estado previo del hook resumen (porque usamos el setResumen).
      ...prev,  // es el operador del spread, copia todas las propiedades del objeto (atributos del objeto).
      // solo actualiza remuneraciones: remuneraciones (version actual) = (prev (version actual) + [field]: value (edición)) <- sería la versión editada.
      ppm: { ...prev.ppm, [field]: value },
    }));
  };

  // Función escuchadora que aplica los cambios a una copia del resumen, incluyendo recalcular totales..
  const handleApplyChanges = () => {
    setLoading(true);  // CAmbiamos el estado a cargar, activa el spiner.
    setError('');
    try {
      // Hacemos una copia para no mutar el state directamente
      const copy = JSON.parse(JSON.stringify(resumen));  // Objeto parseado.
      const updated = recalcularResumen(copy);  // Copia del objeto parseado.
      setResumen(updated);  // Asignamos el objeto nuevo.
      alert('Cambios aplicados y totales recalculados');
    } catch (err) {
      setError('Error al recalcular: ' + (err.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  // Función escuchadora para ejecutar la exportación del resumen de forma asíncrona.
  const handleExport = async () => {
    if (!resumen) return;  // Si no hay un resumen salimos.
    setLoading(true);  // CAmbiamos el estado a cargar, activa el spiner.
    setError('');
    try {
      await exportarResumenAExcel(resumen);  // LLamamos asíncronamente a la función del servicio que llama al backend.
      alert('Excel generado y descargado correctamente');
    } catch (err) {
      setError(err.message || 'Error al exportar el resumen');
    } finally {
      setLoading(false);
    }
  };

  if (!resumen) {  // Si no hay un resumen mostramos un texto por default.
    return (
      <div className="container py-5 text-center">
        <h2 className="text-danger">No hay datos disponibles</h2>
        <button 
          className="btn btn-primary mt-3" 
          onClick={() => navigate('/gestor')}
        >
          Volver a Gestor F29
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5 position-relative">  {/** Contenedor del componente. */}
      <h1 className="mb-5 text-primary text-center">Resumen Formulario 29</h1>  {/** Título. */}

      {error && <div className="alert alert-danger mb-4">{error}</div>}  {/** Si el error está vacio continúa, sino puestra una alerta. */}

      {/** Secciones de la página. */}
      <SeccionContribuyente resumen={resumen} />

      <SeccionDebitosVentas 
        ventasDetalle={resumen.ventas_detalle} 
        ventasTotal={resumen.ventas_total} 
        onChange={handleVentaChange}  // Le pasamos la función escuchadora.
      />

      <SeccionCreditosCompras 
        comprasDetalle={resumen.compras_detalle} 
        comprasTotal={resumen.compras_total} 
        IVAPP={resumen.IVAPP} 
        remanente={resumen.remanente} 
        onChange={handleCompraChange}  // Le pasamos la función escuchadora.
      />

      <SeccionRetencionesTotal 
        remuneraciones={resumen.remuneraciones || {}} 
        honorarios={resumen.honorarios || {}} 
        ppm={resumen.ppm || {}} 
        TT={resumen.TT || 0} 
        onRemChange={handleRemChange}  // Le pasamos la función escuchadora.
        onHonChange={handleHonChange}  // Le pasamos la función escuchadora.
        onPpmChange={handlePpmChange}  // Le pasamos la función escuchadora.
      />

      <div className="d-flex gap-4 justify-content-center mt-5">
        <button // Botón para aplicar los cambios de la previsualización al resumen en memoria.
          className="btn btn-primary btn-lg px-5" 
          onClick={handleApplyChanges}  // Función escuchadora.
          disabled={loading}
        >
          {loading ? 'Aplicando...' : 'Aplicar Cambios'}
        </button>

        <button  // Botón para exportar.
          className="btn btn-success btn-lg px-5" 
          onClick={handleExport}
          disabled={loading}
        >
          {loading ? 'Generando...' : 'Exportar a Excel'}
        </button>

        <button  // Botón para volver.
          className="btn btn-outline-secondary btn-lg px-5" 
          onClick={() => navigate('/gestor')}  // Funcion escuchadora.
        >
          Volver
        </button>
      </div>

      {loading && (  // Componente spinner, puede ser reemplazado por el componente reutilizable.
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
          style={{ zIndex: 9999 }}
        >
          <div className="card p-4 text-center bg-white shadow">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p>Procesando...</p>
          </div>
        </div>
      )}
    </div>
  );
}