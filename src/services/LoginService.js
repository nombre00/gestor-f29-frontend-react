// Servicio de la página login.


// Módulos.
import api from '../api/api'


export const loginUser = async (credentials) => {
  try {
    // Convertir a application/x-www-form-urlencoded
    const formData = new URLSearchParams()
    formData.append('username', credentials.email)  // ← OAuth2 espera "username"
    formData.append('password', credentials.password)
    
    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    
    // Adaptar la respuesta para que coincida con lo que espera el componente
    return {
      user: response.data.user,
      token: response.data.access_token  // ← Mapear access_token a token
    }
  } catch (error) {
    // FastAPI usa "detail" para mensajes de error
    const errorMessage = error.response?.data?.detail || 'Error al iniciar sesión'
    throw new Error(errorMessage)
  }
}