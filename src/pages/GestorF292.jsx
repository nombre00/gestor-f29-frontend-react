// Página donde se ingresan los datos y se procesan.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Componentes
import FileSelector from '../components/FileSelector';
import NumberInput from '../components/NumberInput';
import LoadingOverlay from '../components/LoadingOverlay';
// Services
import { procesarYObtenerResumen2, generarYDescargarExcel2 } from '../services/GestorF29Service';
import { obtenerClientes } from '../services/clienteService';
import api from '../api/api';  // axios

export default function GestorF29() {
  const navigate = useNavigate();

  // Estados existentes
  const [files, setFiles] = useState({});
  const [remanente, setRemanente] = useState(0);
  const [importaciones, setImportaciones] = useState({
    cant_giro: 0, monto_giro: 0, iva_giro: 0,
    cant_activo: 0, monto_activo: 0, iva_activo: 0
  });
  const [showImportaciones, setShowImportaciones] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isReady, setIsReady] = useState(false);

  // Nuevos estados para cliente y período
  const [clientes, setClientes] = useState([]);               // Lista de clientes desde API
  const [selectedClienteId, setSelectedClienteId] = useState(''); // '' = no seleccionado
  const [selectedMes, setSelectedMes] = useState(new Date().getMonth() + 1); // mes actual (1-12)
  const [selectedAnio, setSelectedAnio] = useState(new Date().getFullYear()); // año actual

  // Meses (para mostrar nombre bonito)
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Años: pasado (2), actual, próximo (1) → total 4 opciones
  const anios = [
    new Date().getFullYear() - 2,
    new Date().getFullYear() - 1,
    new Date().getFullYear(),
    new Date().getFullYear() + 1
  ];

  // Cargar lista de clientes al montar el componente
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await obtenerClientes();  // asincrona
        setClientes(response.clientes || []);
      } catch (err) {
        setError('No se pudo cargar la lista de clientes: ' + (err.message || 'Error desconocido'));
      }
    };
    fetchClientes();
  }, []);

  // Habilitar botones solo si: cliente, período, y los 4 archivos están listos
  useEffect(() => {
    const ready =
      selectedClienteId !== '' &&
      selectedMes >= 1 && selectedMes <= 12 &&
      selectedAnio >= 2000 && // validación básica
      !!files.archivo_ventas &&
      !!files.archivo_compras &&
      !!files.archivo_remuneraciones &&
      !!files.archivo_honorarios;

    setIsReady(ready);
  }, [files, selectedClienteId, selectedMes, selectedAnio]);

  // Handler para archivos
  const handleFileSelect = (key) => (file) => {
    setFiles(prev => ({ ...prev, [key]: file }));
    setError('');
  };

  // Construir periodo string 'YYYY-MM'
  const periodo = `${selectedAnio}-${String(selectedMes).padStart(2, '0')}`;

  // Nombre del cliente seleccionado (para mostrar)
  const clienteSeleccionado = clientes.find(c => c.id === Number(selectedClienteId));

  // Generar y descargar Excel
  const handleGenerar = async () => {
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      Object.entries(files).forEach(([key, file]) => {
        if (file) formData.append(key, file);
      });
      formData.append('cliente_id', Number(selectedClienteId));
      formData.append('periodo', periodo);
      // formData.append('remanente_anterior', remanente.toString());
      formData.append('remanente_anterior', Number(remanente));
      formData.append('importaciones', JSON.stringify(importaciones));
      // Log para depurar (quítalo después)
        console.log('FormData enviado:');
        for (let [key, value] of formData.entries()) {
        console.log(key, value);
        }

      await generarYDescargarExcel2(formData); // ← ajusta el service para aceptar FormData

      alert('Resumen generado y descargado');
    } catch (err) {
      setError(err.message || 'Error al generar Excel');
    } finally {
      setLoading(false);
    }
  };

  // Generar y ver resumen
  const handleGenerarYVer = async () => {
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      Object.entries(files).forEach(([key, file]) => {
        if (file) formData.append(key, file);
      });
      formData.append('cliente_id', selectedClienteId);
      formData.append('periodo', periodo);
      formData.append('remanente_anterior', remanente.toString());
      formData.append('importaciones', JSON.stringify(importaciones));

      const data = await procesarYObtenerResumen2(formData); // llamamos al service.

      // navigate('/resumen', { state: { resumen, id_bd: resumen.id_bd } });
      navigate('/resumen', { state: { resumen: data.resumen, id_bd: data.id_bd } })
    } catch (err) {
      setError(err.message || 'Error al generar resumen');
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => {
    navigate('/inicio');
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-primary">Cargar Documentos para F29</h1>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      {/* Select de clientes */}
      <div className="mb-4">
        <label className="form-label fw-bold">Cliente</label>
        <select
          className="form-select"
          value={selectedClienteId}
          onChange={(e) => setSelectedClienteId(e.target.value)}
          disabled={loading}
        >
          <option value="">Selecciona un cliente</option>
          {clientes.map(cliente => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre || cliente.razon_social} ({cliente.rut})
            </option>
          ))}
        </select>
        {clienteSeleccionado && (
          <small className="text-muted d-block mt-1">
            Generando para: <strong>{clienteSeleccionado.razon_social}</strong>
          </small>
        )}
      </div>

      {/* Selector de período */}
      <div className="row mb-4">
        <div className="col-md-6">
          <label className="form-label fw-bold">Mes</label>
          <select
            className="form-select"
            value={selectedMes}
            onChange={(e) => setSelectedMes(Number(e.target.value))}
            disabled={loading}
          >
            {meses.map((mes, idx) => (
              <option key={idx + 1} value={idx + 1}>
                {mes}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold">Año</label>
          <select
            className="form-select"
            value={selectedAnio}
            onChange={(e) => setSelectedAnio(Number(e.target.value))}
            disabled={loading}
          >
            {anios.map(anio => (
              <option key={anio} value={anio}>
                {anio}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Resto del formulario igual */}
      <FileSelector label="Detalle de Ventas" onFileChange={handleFileSelect('archivo_ventas')} />
      <FileSelector label="Detalle de Compras" onFileChange={handleFileSelect('archivo_compras')} />
      <FileSelector label="Libro de Remuneraciones" onFileChange={handleFileSelect('archivo_remuneraciones')} />
      <FileSelector label="Registro de Honorarios" onFileChange={handleFileSelect('archivo_honorarios')} />

      <NumberInput label="Remanente mes anterior" value={remanente} onChange={setRemanente} />

      <button
        className="btn btn-outline-info mt-3 mb-3"
        onClick={() => setShowImportaciones(!showImportaciones)}
        disabled={loading}
      >
        {showImportaciones ? 'Ocultar Importaciones' : 'Incluir Importaciones'}
      </button>

      {showImportaciones && (
        <div className="card p-4 mb-4">
          <p>Formulario de importaciones (implementar con radios e inputs)</p>
        </div>
      )}

      <div className="d-flex gap-3 justify-content-center">
        <button
          className="btn btn-success btn-lg"
          onClick={handleGenerar}
          disabled={!isReady || loading}
        >
          Generar Resumen F29
        </button>

        <button
          className="btn btn-primary btn-lg"
          onClick={handleGenerarYVer}
          disabled={!isReady || loading}
        >
          Generar y Ver Resumen F29
        </button>

        <button
          className="btn btn-secondary btn-lg"
          onClick={handleVolver}
          disabled={loading}
        >
          Volver
        </button>
      </div>

      {loading && <LoadingOverlay text="Generando resumen F29..." />}
    </div>
  );
}