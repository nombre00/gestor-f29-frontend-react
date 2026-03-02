// Servicio para consumir endpoints de resúmenes F29.

import api from '../api/api';

// Obtiene los f29s de los clientes de una empresa durante un periodo. 
export const obtenerDashboardContador = async ({ mes, anio } = {}) => {
  const params = {};
  if (mes)  params.mes  = mes;
  if (anio) params.anio = anio;
  const response = await api.get('/api/resumenes/dashboard', { params });
  return response.data;
};

// Borrar.
export const eliminarResumen = async (resumenId) => {
  const response = await api.delete(`/api/resumenes/${resumenId}`);
  return response.data;
};

// Cambia estado de un f29.
export const cambiarEstadoResumen = async (resumenId, estado) => {
  const response = await api.put(`/api/resumenes/${resumenId}/estado`, { estado });
  return response.data;
};

// Busca por id.
export const obtenerResumenPorId = async (resumenId) => {
  const response = await api.get(`/api/resumenes/${resumenId}`);
  return response.data;
};







////// funciones de resumenAnual ///////
export const obtenerDashboardResumenAnual = async (anio) => {
  const response = await api.get('/api/f29/resumen-anual/dashboard', { params: { anio } });
  return response.data;
};

// Busca un resumenAnual por cliente id y año.
export const obtenerResumenAnual = async (clienteId, año) => {
  const response = await api.get(`/api/f29/resumen-anual/${clienteId}/${año}`);
  return response.data;
};

// Recalcula un resumenAnual por cliente id y año.
export const recalcularResumenAnual = async (clienteId, año) => {
  const response = await api.post(`/api/f29/resumen-anual/${clienteId}/${año}/recalcular`);
  return response.data;
};