// Servicio de la vista vistaResumenF29.  


import api from '../api/api'

/** 
 * Exporta el resumen F29 al backend y descarga el Excel generado
 * @param {Object} resumen - El objeto completo del resumen
 * @returns {Promise<void>}
 */
export const exportarResumenAExcel = async (resumen) => {
  try {
    const response = await api.post('/f29/resumen/exportar', { resumen }, {
      responseType: 'blob',  // importante: recibimos binario (Excel)
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
    // Axios ya nos da un error limpio gracias al interceptor
    throw new Error(error.message || 'Error al generar y descargar el Excel')
  }
}