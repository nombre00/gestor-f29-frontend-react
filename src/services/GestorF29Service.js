// Service de la página gestorf29.


import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'  // cámbialo a .env después

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,  // 30 segundos, ajusta según tus archivos grandes
  headers: {
    'Accept': 'application/json',
  },
})

// Interceptor para manejar errores globales (opcional pero recomendado)
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
    throw new Error(message)
  }
)

/**
 * Procesa los archivos y devuelve el resumen F29 en JSON
 * @param {Object} params
 * @param {Object} params.files - { ventas: File, compras: File, ... }
 * @param {number} params.remanente
 * @param {Object} params.importaciones
 * @returns {Promise<Object>} Resumen F29
 */
export const procesarYObtenerResumen = async ({ files, remanente, importaciones }) => {
  const formData = new FormData()

  // Agregar archivos
  Object.entries(files).forEach(([key, file]) => {
    if (file instanceof File) {
      formData.append(key, file)
    }
  })

  // Agregar datos como JSON string (el backend debe parsearlo)
  formData.append('remanente_anterior', remanente.toString())
  formData.append('importaciones', JSON.stringify(importaciones))

  try {
    const response = await api.post('/f29/procesar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    const resumen = response.data.resumen
    if (!resumen) {
      throw new Error('El backend no devolvió un resumen válido')
    }

    return resumen  // { encabezado, ventas_detalle, compras_detalle, ... }
  } catch (error) {
    throw error  // lo atrapamos en la página
  }
}

/**
 * Genera y descarga el Excel directamente (sin guardar en disco, ya que es frontend)
 * @param {Object} params - igual que arriba
 */
export const generarYDescargarExcel = async ({ files, remanente, importaciones }) => {
  const formData = new FormData()

  Object.entries(files).forEach(([key, file]) => {
    if (file instanceof File) {
      formData.append(key, file)
    }
  })

  formData.append('remanente_anterior', remanente.toString())
  formData.append('importaciones', JSON.stringify(importaciones))

  try {
    const response = await api.post('/f29/generar-excel', formData, {
      responseType: 'blob',  // importante: recibimos binario
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    // Crear blob y descargar
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Resumen_F29_${new Date().toISOString().slice(0,10)}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    return true
  } catch (error) {
    throw error
  }
}