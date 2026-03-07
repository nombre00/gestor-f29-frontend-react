// Servicio para consumir endpoints de clientes.

import api from '../api/api';


// Valor inicial del formulario de cliente 
// Vive aquí para ser reutilizado tanto por el contador (registrarCliente) como por el admin (administrarClientes). 
export const CLIENTE_FORM_INICIAL = {
  rut:                 '',
  razon_social:        '',
  nombre_comercial:    '',
  giro:                '',
  actividad_economica: '',
  nro_cliente:         '',
  direccion:           '',
  comuna:              '',
  ciudad:              '',
  contacto_nombre:     '',
  contacto_email:      '',
  contacto_telefono:   '',
};



// Lista los clientes de una empresa.
export const obtenerClientes = async () => {
  const response = await api.get('/api/clientes');
  return response.data;   // { clientes: [], total: number }
};


// Obtiene un cliente por ID.
export const obtenerCliente = async (clienteId) => {
  const response = await api.get(`/api/clientes/${clienteId}`);
  return response.data;
};


// Crea un nuevo cliente.
export const crearCliente = async (datos) => {
  const response = await api.post('/api/clientes', datos);
  return response.data;
};

// Actualizar.
export const actualizarCliente = async (clienteId, datos) => {
  const response = await api.put(`/api/clientes/${clienteId}`, datos);
  return response.data;
};

// Desactiva un cliente.
export const desactivarCliente = async (clienteId) => {
  const response = await api.put(`/api/clientes/${clienteId}/desactivar`);
  return response.data;
};

// Reasignar cliente.
export const reasignarCliente = async (clienteId, nuevoUsuarioId) => {
  const response = await api.put(
    `/api/clientes/${clienteId}/reasignar`, null, { params: { nuevo_usuario_id: nuevoUsuarioId } }
  );
  return response.data;
};