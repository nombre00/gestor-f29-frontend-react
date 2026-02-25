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