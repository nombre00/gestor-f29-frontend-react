// Servicio para consumir endpoints de resúmenes F29.

import api from '../api/api';

/**
 * Obtiene los datos del dashboard del contador para un período.
 * Llama a GET /api/resumenes/dashboard
 * @param {{ mes?: number, anio?: number }} opciones - Período a consultar. Por defecto el mes actual.
 * @returns {Promise<{
 *   mes: number,
 *   anio: number,
 *   resumenes_hechos: ResumenF29ListItem[],
 *   clientes_pendientes: ClienteSinResumenItem[],
 *   total_hechos: number,
 *   total_pendientes: number
 * }>}
 */
export const obtenerDashboardContador = async ({ mes, anio } = {}) => {
  const params = {};
  if (mes)  params.mes  = mes;
  if (anio) params.anio = anio;
  const response = await api.get('/api/resumenes/dashboard', { params });
  return response.data;
};