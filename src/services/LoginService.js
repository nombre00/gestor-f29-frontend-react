// Servicio de la página login.


// Biblioteca.
import axios from 'axios'  // Ayuda con REST.

const api = axios.create({
  baseURL: 'http://localhost:5000/api',   // tu backend Python
  timeout: 10000,                         // 10 segundos máximo
})

// Interceptor para agregar token si existe (muy común en producción)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/login', credentials)
    return response.data   // { user, token }
  } catch (error) {
    // Axios da error.response con status, data, etc.
    throw new Error(error.response?.data?.message || 'Error al iniciar sesión')
  }
}