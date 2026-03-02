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
  // Hooks
  // Para navegar.
  const navigate = useNavigate();

  // Estados existentes
  const [files, setFiles] = useState({});  // Receptor de los archivos.
  const [remanente, setRemanente] = useState(0);  // Receptor del remanente.
  const [loading, setLoading] = useState(false);  // maneja el spinner
  const [error, setError] = useState('');  // mensaje de error.
  const [isReady, setIsReady] = useState(false);  // Para habilitar botónes.

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

  // Rango de años.
  const hoydia = new Date();
  const añoActual = hoydia.getFullYear();
  const añoInicio = 1980;
  const añoFin = añoActual + 1;
  const anios = Array.from({ length: añoFin - añoInicio + 1 },(_, i) => añoInicio + i);

  // Nuevos estados para datos extra.
  const [arriendosPagados, setArriendosPagados] = useState(0);
  const [gastosGeneralesBoletas, setGastosGeneralesBoletas] = useState(0);


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
    setIsReady(ready);  // Si está todo cambiamos el estado y habilitamos.
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
      // Inicio datos nuevos.
      formData.append('arriendos_pagados', Number(arriendosPagados));
      formData.append('gastos_generales_boletas', Number(gastosGeneralesBoletas));
      // Fin datos nuevos.

      await generarYDescargarExcel2(formData);  // LLamamos al service.

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
      // Inicio datos nuevos.
      formData.append('arriendos_pagados', Number(arriendosPagados));
      formData.append('gastos_generales_boletas', Number(gastosGeneralesBoletas));
      // Fin datos nuevos.
      // Importaciones deprecado.
      // formData.append('importaciones', JSON.stringify(importaciones));

      const data = await procesarYObtenerResumen2(formData); // llamamos al service.

      // navigate('/resumen', { state: { resumen, id_bd: resumen.id_bd } });
      navigate('/resumen', { state: { resumen: data.resumen, id_bd: data.id_bd } })
    } catch (err) {
      setError(err.message || 'Error al generar resumen');
    } finally {
      setLoading(false);
    }
  };

  // Para el botón volver.
  const handleVolver = () => {
    navigate('/inicio');
  };



  return (
    <div className="container py-5">
      <h1 className="mb-4 text-primary">Cargar Documentos para F29</h1>
      {error && <div className="alert alert-danger mb-4">{error}</div>}
      {/* Selector de clientes */}
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
      {/* Selector de período. */}
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
      {/* Selección de archivos. */}
      <FileSelector label="Detalle de Ventas" onFileChange={handleFileSelect('archivo_ventas')} />
      <FileSelector label="Detalle de Compras" onFileChange={handleFileSelect('archivo_compras')} />
      <FileSelector label="Libro de Remuneraciones" onFileChange={handleFileSelect('archivo_remuneraciones')} />
      <FileSelector label="Registro de Honorarios" onFileChange={handleFileSelect('archivo_honorarios')} />
      {/* ingreso del remanente. */}
      <NumberInput label="Remanente mes anterior" value={remanente} onChange={setRemanente} />
      {/* ingreso de datos extra. */}
      <NumberInput label="Arriendos pagados" value={arriendosPagados} onChange={setArriendosPagados}/>
      <NumberInput label="Gastos generales (boletas)" value={gastosGeneralesBoletas} onChange={setGastosGeneralesBoletas}/>
      {/* botones de acciones. */}
      <div className="d-flex gap-3 justify-content-center">
        {/* botón apra generar + persistir + exportar. */}
        <button
          className="btn btn-success btn-lg"
          onClick={handleGenerar}
          disabled={!isReady || loading}
        >
          Generar Resumen F29
        </button>
        {/* botón para generar + persistir + enrutar a previsualización. */}
        <button
          className="btn btn-primary btn-lg"
          onClick={handleGenerarYVer}
          disabled={!isReady || loading}
        >
          Generar y Ver Resumen F29
        </button>
        {/* botón para volver al inicio. */}
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