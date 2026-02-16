// Servicio para gestión de invitaciones de usuarios

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Obtiene el token de autenticación del localStorage
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

/**
 * Crear una nueva invitación
 */
export const crearInvitacion = async (invitacionData) => {
  const response = await fetch(`${API_BASE_URL}/api/invitaciones`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(invitacionData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Error al crear invitación');
  }

  return await response.json();
};

/**
 * Obtener lista de invitaciones pendientes
 */
export const obtenerInvitacionesPendientes = async () => {
  const response = await fetch(`${API_BASE_URL}/api/invitaciones/pendientes`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Error al obtener invitaciones');
  }

  return await response.json();
};

/**
 * Reenviar una invitación
 */
export const reenviarInvitacion = async (invitacionId) => {
  const response = await fetch(`${API_BASE_URL}/api/invitaciones/${invitacionId}/reenviar`, {
    method: 'POST',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Error al reenviar invitación');
  }

  return await response.json();
};

/**
 * Cancelar una invitación
 */
export const cancelarInvitacion = async (invitacionId) => {
  const response = await fetch(`${API_BASE_URL}/api/invitaciones/${invitacionId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Error al cancelar invitación');
  }

  return await response.json();
};

/**
 * Validar un token de invitación
 */
export const validarTokenInvitacion = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/invitaciones/validar-token/${token}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Token inválido');
  }

  return await response.json();
};

/**
 * Completar registro con token de invitación
 */
export const completarRegistro = async (registroData) => {
  const response = await fetch(`${API_BASE_URL}/api/invitaciones/completar-registro`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(registroData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Error al completar registro');
  }

  return await response.json();
};