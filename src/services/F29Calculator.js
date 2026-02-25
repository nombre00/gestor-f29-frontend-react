// Cálculo para la página vistaresumenf29.


// Formatea para presentación.
export const formatCLP = (num) => {
  return num.toLocaleString('es-CL', { minimumFractionDigits: 0 })
}

// Desformatea para edición
export const unformatCLP = (value) => {
  return parseInt(value.replace(/\./g, '').replace(/[^0-9]/g, '')) || 0;
};



// Recalcula todos los totales y actualiza el objeto resumen
export const recalcularResumen = (resumen) => {
  // 1. Ventas
  let total_td_ventas = 0, total_neto_ventas = 0, total_iva_ventas = 0
  resumen.ventas_detalle.forEach(det => {
    if (det.tipo !== 61) {
      total_td_ventas += Number(det.td || 0)
      total_neto_ventas += Number(det.neto || 0)
      total_iva_ventas += Number(det.iva || 0)
    }
  })
  const cod61 = resumen.ventas_detalle.find(d => d.tipo === 61) || { td: 0, neto: 0, iva: 0 }
  total_td_ventas += Number(cod61.td)
  total_neto_ventas -= Number(cod61.neto)
  total_iva_ventas -= Number(cod61.iva)

  total_iva_ventas = Math.max(0, total_iva_ventas); // Por normativa este valor nunca es nemor que 0.

  resumen.ventas_total = {
    td: total_td_ventas,
    neto: total_neto_ventas,
    iva: total_iva_ventas
  }

  // 2. Compras
  let total_td_compras = 0, total_neto_compras = 0, total_iva_rec = 0
  resumen.compras_detalle.forEach(det => {
    if (det.tipo !== 61) {
      total_td_compras += Number(det.td || 0)
      total_neto_compras += Number(det.neto || 0)
      total_iva_rec += Number(det.iva_rec || 0)
    }
  })
  const cod61_comp = resumen.compras_detalle.find(d => d.tipo === 61) || { td: 0, neto: 0, iva_rec: 0 }
  total_td_compras += Number(cod61_comp.td)
  total_neto_compras -= Number(cod61_comp.neto)
  total_iva_rec -= Number(cod61_comp.iva_rec)

  total_iva_rec = Math.max(0, total_iva_rec);  // Si el iva_rec es < 0 entonces iva_rec = 0; no puede tomar valores negativos.

  resumen.compras_total = {
    td: total_td_compras,
    neto: total_neto_compras,
    iva_rec: total_iva_rec
  }

  // 3. IVA por pagar y remanente
  const iva_neto_ajustado = total_iva_ventas - total_iva_rec - (resumen.remanenteMesAnterior || 0)
  resumen.IVAPP = iva_neto_ajustado > 0 ? iva_neto_ajustado : 0
  resumen.remanente = iva_neto_ajustado > 0 ? 0 : -iva_neto_ajustado

  // 4. Remuneraciones y PPM (asumiendo que se editan directamente en el objeto)
  // Preservamos y validamos que no sean negativos
  resumen.remuneraciones = {
    ...resumen.remuneraciones,
    th_remuneraciones: Math.max(0, Number(resumen.remuneraciones?.th_remuneraciones || 0)),
    impt_unico: Math.max(0, Number(resumen.remuneraciones?.impt_unico || 0)),
    base_rem_3porc: Math.max(0, Number(resumen.remuneraciones?.base_rem_3porc || 0)),
    rem_3porc: Math.max(0, Number(resumen.remuneraciones?.rem_3porc || 0)),
  };

  resumen.honorarios = {
    ...resumen.honorarios,
    honorarios: Math.max(0, Number(resumen.honorarios?.honorarios || 0)),
    retencion: Math.max(0, Number(resumen.honorarios?.retencion || 0)),
    cod155: Math.max(0, Number(resumen.honorarios?.cod155 || 0)),
  };

  resumen.ppm = {
    ...resumen.ppm,
    base: Math.max(0, Number(resumen.ppm?.base || 0)),
    tasa: Number(resumen.ppm?.tasa || 0.2),  // Respeta edición o usa 0.2
    ppm: Math.round(
      (Number(resumen.ppm?.base || 0) * (Number(resumen.ppm?.tasa || 0.2))) / 100
    ),
    PPM2_base: Math.max(0, Number(resumen.ppm?.PPM2_base || 0)),
    PPM2_valor: Math.max(0, Number(resumen.ppm?.PPM2_valor || 0)),
    PPM_transportista_base: Math.max(0, Number(resumen.ppm?.PPM_transportista_base || 0)),
    PPM_transportista_valor: Math.max(0, Number(resumen.ppm?.PPM_transportista_valor || 0)),
  };

  // 5. Total a pagar (TT)
  resumen.TT =
    resumen.IVAPP +
    (resumen.remuneraciones?.impt_unico || 0) +
    (resumen.remuneraciones?.rem_3porc || 0) +
    (resumen.honorarios?.cod155 || 0) +
    (resumen.ppm?.ppm || 0) +
    (resumen.ppm?.PPM2_valor || 0) +
    (resumen.ppm?.PPM_transportista_valor || 0);

  // 6. Datos extra → se preservan tal cual
  resumen.arriendos_pagados = Number(resumen.arriendos_pagados || 0);
  resumen.gastos_generales_boletas = Number(resumen.gastos_generales_boletas || 0);

  return resumen
}