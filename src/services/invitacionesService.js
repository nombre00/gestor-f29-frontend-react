// Servicio para gestión de invitaciones de usuarios

// Servicio para gestión de invitaciones

import api from '../api/api';

/**
 * Crear una nueva invitación
 */
export const crearInvitacion = async (invitacionData) => {
  const response = await api.post('/api/invitaciones', invitacionData);
  return response.data;
};

/**
 * Obtener lista de invitaciones pendientes
 */
export const obtenerInvitacionesPendientes = async () => {
  const response = await api.get('/api/invitaciones/pendientes');
  return response.data;
};

/**
 * Reenviar una invitación
 */
export const reenviarInvitacion = async (invitacionId) => {
  const response = await api.post(`/api/invitaciones/${invitacionId}/reenviar`);
  return response.data;
};

/**
 * Cancelar una invitación
 */
export const cancelarInvitacion = async (invitacionId) => {
  const response = await api.delete(`/api/invitaciones/${invitacionId}`);
  return response.data;
};

/**
 * Validar un token de invitación (endpoint público, sin auth)
 */
export const validarTokenInvitacion = async (token) => {
  const response = await api.get(`/api/invitaciones/validar-token/${token}`, {
    headers: { Authorization: undefined }  // Excluir header de auth, es ruta pública
  });
  return response.data;
};

/**
 * Completar registro con token de invitación (endpoint público, sin auth)
 */
export const completarRegistro = async (registroData) => {
  const response = await api.post('/api/invitaciones/completar-registro', registroData, {
    headers: { Authorization: undefined }  // Excluir header de auth, es ruta pública
  });
  return response.data;
};