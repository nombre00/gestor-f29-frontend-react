// Servicio para gestión de usuarios (incluye perfil propio)

import api from '../api/api';

/**
 * Obtener lista de usuarios de la empresa (solo admins)
 */
export const obtenerUsuarios = async () => {
  const response = await api.get('/api/usuarios');
  return response.data;
};

/**
 * Desactivar un usuario
 */
export const desactivarUsuario = async (usuarioId) => {
  const response = await api.put(`/api/usuarios/${usuarioId}/desactivar`);
  return response.data;
};

/**
 * Reactivar un usuario
 */
export const reactivarUsuario = async (usuarioId) => {
  const response = await api.put(`/api/usuarios/${usuarioId}/reactivar`);
  return response.data;
};

/**
 * Obtener perfil del usuario autenticado
 */
export const obtenerPerfil = async () => {
  const response = await api.get('/api/usuarios/me');
  return response.data;
};

/**
 * Cambiar contraseña del usuario autenticado
 */
export const cambiarPassword = async ({ password_actual, password_nueva }) => {
  const response = await api.put('/api/usuarios/me/password', {
    password_actual,
    password_nueva
  });
  return response.data;
};