// Servicio para consumir endpoints de clientes.

import api from '../api/api';


// ── Valor inicial del formulario de cliente ───────────────────────────────────
// Vive aquí para ser reutilizado tanto por el contador (registrarCliente)
// como por el admin (administrarClientes). 
export const CLIENTE_FORM_INICIAL = {
  rut:                 '',
  razon_social:        '',
  nombre_comercial:    '',
  giro:                '',
  actividad_economica: '',
  direccion:           '',
  comuna:              '',
  ciudad:              '',
  contacto_nombre:     '',
  contacto_email:      '',
  contacto_telefono:   '',
};


// ── Funciones ────────────────────────────────────────────────────────────────

/**
 * Lista clientes según el rol del usuario logueado:
 * admin → todos los de la empresa | contador → solo los suyos.
 */
export const obtenerClientes = async () => {
  const response = await api.get('/api/clientes');
  return response.data;   // { clientes: [], total: number }
};

/**
 * Obtiene un cliente por ID.
 */
export const obtenerCliente = async (clienteId) => {
  const response = await api.get(`/api/clientes/${clienteId}`);
  return response.data;
};

/**
 * Crea un nuevo cliente.
 * El backend asigna automáticamente al contador; el admin puede pasar asignado_a_usuario_id.
 */
export const crearCliente = async (datos) => {
  const response = await api.post('/api/clientes', datos);
  return response.data;
};

/**
 * Actualiza datos de un cliente.
 */
export const actualizarCliente = async (clienteId, datos) => {
  const response = await api.put(`/api/clientes/${clienteId}`, datos);
  return response.data;
};

/**
 * Desactiva un cliente (soft delete).
 */
export const desactivarCliente = async (clienteId) => {
  const response = await api.put(`/api/clientes/${clienteId}/desactivar`);
  return response.data;
};

/**
 * Reasigna un cliente a otro contador.
 * Solo admins.
 */
export const reasignarCliente = async (clienteId, nuevoUsuarioId) => {
  const response = await api.put(
    `/api/clientes/${clienteId}/reasignar`,
    null,
    { params: { nuevo_usuario_id: nuevoUsuarioId } }
  );
  return response.data;
};