// Servicio para gestión de usuarios

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
 * Obtener lista de usuarios de la empresa
 */
export const obtenerUsuarios = async () => {
  const response = await fetch(`${API_BASE_URL}/api/usuarios`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Error al obtener usuarios');
  }

  return await response.json();
};

/**
 * Desactivar un usuario
 */
export const desactivarUsuario = async (usuarioId) => {
  const response = await fetch(`${API_BASE_URL}/api/usuarios/${usuarioId}/desactivar`, {
    method: 'PUT',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Error al desactivar usuario');
  }

  return await response.json();
};

/**
 * Reactivar un usuario
 */
export const reactivarUsuario = async (usuarioId) => {
  const response = await fetch(`${API_BASE_URL}/api/usuarios/${usuarioId}/reactivar`, {
    method: 'PUT',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Error al reactivar usuario');
  }

  return await response.json();
};