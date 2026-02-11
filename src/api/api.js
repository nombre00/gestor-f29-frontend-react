// Es la conección con el backend.


import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Interceptor para errores (opcional pero útil)
api.interceptors.response.use(
  response => response,
  error => {
    let message = 'Error desconocido'
    if (error.response) {
      message = error.response.data?.message || `Error ${error.response.status}`
    } else if (error.request) {
      message = 'No se pudo conectar al servidor'
    } else {
      message = error.message
    }
    return Promise.reject(new Error(message))
  }
)

export default api