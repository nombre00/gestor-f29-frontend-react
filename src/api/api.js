// Es la conección con el backend.


import axios from 'axios'

// Instancia de la conección y ruta 'raiz'.
const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Interceptor para agregar token automáticamente.
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// Interceptor para errores, revisa que el token del usuario esté presente y lo valida.
api.interceptors.response.use(
  response => response,
  error => {
    let message = 'Error desconocido'
    if (error.response) {
      message = error.response.data?.detail || error.response.data?.message || `Error ${error.response.status}`
    } else if (error.request) {
      message = 'No se pudo conectar al servidor'
    } else {
      message = error.message
    }
    return Promise.reject(new Error(message))
  }
)

export default api