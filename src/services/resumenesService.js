// Servicio para consumir endpoints de resúmenes F29.

import api from '../api/api';

/**
 * Obtiene los datos del dashboard del contador para un período.
 * GET /api/resumenes/dashboard
 */
export const obtenerDashboardContador = async ({ mes, anio } = {}) => {
  const params = {};
  if (mes)  params.mes  = mes;
  if (anio) params.anio = anio;
  const response = await api.get('/api/resumenes/dashboard', { params });
  return response.data;
};

/**
 * Elimina un resumen F29 (solo borradores).
 * DELETE /api/resumenes/{resumen_id}
 */
export const eliminarResumen = async (resumenId) => {
  const response = await api.delete(`/api/resumenes/${resumenId}`);
  return response.data;
};

/**
 * Cambia el estado de un resumen F29.
 * PUT /api/resumenes/{resumen_id}/estado
 * @param {number} resumenId
 * @param {'borrador' | 'revisado'} estado
 */
export const cambiarEstadoResumen = async (resumenId, estado) => {
  const response = await api.put(`/api/resumenes/${resumenId}/estado`, { estado });
  return response.data;
};

/**
 * Obtiene un resumen F29 completo por ID (incluye detalles_json).
 * GET /api/resumenes/{resumen_id}
 */
export const obtenerResumenPorId = async (resumenId) => {
  const response = await api.get(`/api/resumenes/${resumenId}`);
  return response.data;
};







////// funciones de resumenAnual ///////
export const obtenerDashboardResumenAnual = async (anio) => {
  const response = await api.get('/api/f29/resumenes/anual/dashboard', { params: { anio } });
  return response.data;
};

/**
 * Obtiene (o crea vacío) el resumen anual de un cliente para un año específico.
 * GET /api/f29/resumen-anual/{cliente_id}/{año}
 * @param {number} clienteId - ID del cliente
 * @param {string} año - Año en formato YYYY (ej: "2025")
 */
export const obtenerResumenAnual = async (clienteId, año) => {
  const response = await api.get(`/api/f29/resumen-anual/${clienteId}/${año}`);
  return response.data;
};

/**
 * Recalcula/actualiza el resumen anual sumando todos los F29 existentes del año.
 * POST /api/f29/resumen-anual/{cliente_id}/{año}/recalcular
 * @param {number} clienteId - ID del cliente
 * @param {string} año - Año en formato YYYY (ej: "2025")
 */
export const recalcularResumenAnual = async (clienteId, año) => {
  const response = await api.post(`/api/f29/resumen-anual/${clienteId}/${año}/recalcular`);
  return response.data;
};