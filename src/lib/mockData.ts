import type { Viaje, Usuario, HighlightsPeriodo, BonoE, Bono5SE, Historico, EstatusPago, EstatusBonoManager, BonoManager } from './types'

// Generar datos mock de viajes
export function seedViajes(): Viaje[] {
  const viajes: Viaje[] = []
  const especialistas = ['Lisa Brissac', 'María González', 'Carlos Rodríguez', 'Ana Martínez', 'Luis Pérez']
  const roles: Array<'Especialista' | 'Apoyo' | 'Reservas' | 'Seguimiento' | 'Tripbook'> = ['Especialista', 'Apoyo', 'Reservas', 'Seguimiento', 'Tripbook']
  
  for (let i = 0; i < 1500; i++) {
    // Generar fechas más realistas - incluir tanto 2024 como 2025
    const anio = Math.random() > 0.3 ? 2024 : 2025 // 70% 2024, 30% 2025
    const mes = Math.floor(Math.random() * 12) + 1
    const dia = Math.floor(Math.random() * 28) + 1
    
    const fechaVenta = new Date(anio, mes - 1, dia)
    const fechaViaje = new Date(fechaVenta)
    fechaViaje.setDate(fechaViaje.getDate() + Math.floor(Math.random() * 90) + 30) // 30-120 días después de la venta
    
    // Asegurar que la fecha de viaje no sea en el futuro (más de 6 meses)
    const fechaLimite = new Date()
    fechaLimite.setMonth(fechaLimite.getMonth() + 6)
    if (fechaViaje > fechaLimite) {
      fechaViaje.setMonth(fechaLimite.getMonth())
      fechaViaje.setDate(Math.floor(Math.random() * 28) + 1)
    }
    
    // Generar utilidad cotizada (siempre disponible)
    const utilidadCotizada = Math.floor(Math.random() * 50000) + 10000
    
    // Generar utilidad real solo si el viaje ya pasó
    const ahora = new Date()
    const viajeYaPaso = fechaViaje < ahora
    const utilidadReal = viajeYaPaso ? Math.floor(utilidadCotizada * (0.7 + Math.random() * 0.6)) : null // 70%-130% de la cotizada
    
    // Generar ingresos y COGS
    const ingresoCotizado = utilidadCotizada + Math.floor(Math.random() * 100000) + 50000
    const ingresoReal = viajeYaPaso ? Math.floor(ingresoCotizado * (0.8 + Math.random() * 0.4)) : null
    const cogsCotizados = ingresoCotizado - utilidadCotizada
    const cogsReales = viajeYaPaso ? (ingresoReal || 0) - (utilidadReal || 0) : null
    
    // Compradores disponibles
    const compradores: Array<'Evaneos Fr' | 'Kim kim' | 'Travel Local' | 'Evaneos It' | 'Tourlane'> = [
      'Evaneos Fr', 'Kim kim', 'Travel Local', 'Evaneos It', 'Tourlane'
    ]
    const comprador = compradores[Math.floor(Math.random() * compradores.length)]
    
    // Moneda original (USD o EUR)
    const monedas: Array<'USD' | 'EUR'> = ['USD', 'EUR']
    const monedaOriginal = monedas[Math.floor(Math.random() * monedas.length)]
    const tipoCambio = monedaOriginal === 'USD' ? 16.5 + Math.random() * 3 : 17.5 + Math.random() * 2 // Tipo de cambio realista
    const ingresoMonedaOriginal = {
      monto: ingresoCotizado * (monedaOriginal === 'USD' ? 0.055 : 0.050), // Conversión aproximada a USD/EUR
      moneda: monedaOriginal,
      tipoCambio
    }
    
    // Determinar esquema basado en fecha de venta
    const esEsquemaNuevo = fechaVenta >= new Date('2025-09-01')
    
    // Porcentajes según esquema
    const anticipoPorcentaje = esEsquemaNuevo ? 0.04 : 0.045 // 4% nuevo, 4.5% anterior
    const liquidacionPorcentaje = esEsquemaNuevo ? 0.09 : 0.09 // 9% ambos esquemas
    
    const anticipoMonto = utilidadCotizada * anticipoPorcentaje
    
    // Lógica del Bono Manager
    // Solo aplica si NO son especialistas pero son parte del mercado gestionado
    // Para simular esto, usaremos un 20% de probabilidad
    const aplicaBonoManager = Math.random() < 0.2 && utilidadReal !== null
    const porcentajeBonoManager = 0.01 // 1% de la utilidad real
    const comisionBonoManager = aplicaBonoManager ? utilidadReal * porcentajeBonoManager : 0
    
    // Status del Bono Manager
    let statusBonoManager: EstatusBonoManager
    let bonoManagerAprobado: boolean
    let notaBonoManagerRechazo: string | undefined
    let notaBonoManagerPospuesto: string | undefined
    
    if (!aplicaBonoManager) {
      statusBonoManager = 'N/A'
      bonoManagerAprobado = false
    } else {
      if (Math.random() < 0.05) {
        // 5% de bonos pospuestos por admin
        statusBonoManager = 'Pospuesto'
        bonoManagerAprobado = false
        notaBonoManagerPospuesto = ['Falta documentación', 'Esperando confirmación del cliente', 'Problemas de presupuesto'][Math.floor(Math.random() * 3)]
      } else if (Math.random() < 0.1) {
        // 10% de bonos con N/A (fecha no llegó)
        statusBonoManager = 'N/A'
        bonoManagerAprobado = false
      } else if (Math.random() < 0.2) {
        // 20% de bonos aprobados
        statusBonoManager = 'Aprobado'
        bonoManagerAprobado = true
      } else if (Math.random() < 0.1) {
        // 10% de bonos rechazados
        statusBonoManager = 'Rechazado'
        bonoManagerAprobado = false
      } else if (Math.random() < 0.3) {
        // 30% de bonos pagados
        statusBonoManager = 'Pagado'
        bonoManagerAprobado = true
      } else {
        // 25% de bonos pendientes
        statusBonoManager = 'Pendiente'
        bonoManagerAprobado = false
      }
    }
    
    // Nueva lógica de status para anticipo y liquidación
    let statusAnticipo: EstatusPago
    let statusLiquidacion: EstatusPago
    let anticipoAprobado: boolean
    let liquidacionAprobada: boolean
    let notaAnticipoPospuesto: string | undefined
    let notaLiquidacionPospuesta: string | undefined
    
    // Determinar status del anticipo
    const fechaVentaYaPaso = fechaVenta < ahora
    
    if (Math.random() < 0.05) {
      // 5% de viajes pospuestos por admin
      statusAnticipo = 'Pospuesto'
      anticipoAprobado = false
      notaAnticipoPospuesto = ['Falta documentación', 'Esperando confirmación del cliente', 'Problemas de presupuesto'][Math.floor(Math.random() * 3)]
    } else if (Math.random() < 0.1 && !fechaVentaYaPaso) {
      // 10% de viajes con N/A (fecha de anticipo no llegó) - SOLO si la venta NO ha pasado
      statusAnticipo = 'N/A'
      anticipoAprobado = false
    } else if (Math.random() < 0.2) {
      // 20% de anticipos aprobados
      statusAnticipo = 'Aprobado'
      anticipoAprobado = true
    } else if (Math.random() < 0.1) {
      // 10% de anticipos rechazados
      statusAnticipo = 'Rechazado'
      anticipoAprobado = false
    } else if (Math.random() < 0.3) {
      // 30% de anticipos pagados (solo si fueron aprobados previamente)
      statusAnticipo = 'Pagado'
      anticipoAprobado = true
    } else {
      // 25% de anticipos pendientes
      statusAnticipo = 'Pendiente'
      anticipoAprobado = false
    }
    
    // Determinar status de la liquidación
    if (utilidadReal !== null) {
      if (Math.random() < 0.05) {
        // 5% de liquidaciones pospuestas por admin
        statusLiquidacion = 'Pospuesto'
        liquidacionAprobada = false
        notaLiquidacionPospuesta = ['Esperando facturación', 'Problemas de conciliación', 'Documentación incompleta'][Math.floor(Math.random() * 3)]
      } else if (Math.random() < 0.1 && !fechaVentaYaPaso) {
        // 10% de liquidaciones con N/A (fecha no llegó) - SOLO si la venta NO ha pasado
        statusLiquidacion = 'N/A'
        liquidacionAprobada = false
      } else if (Math.random() < 0.2) {
        // 20% de liquidaciones aprobadas
        statusLiquidacion = 'Aprobado'
        liquidacionAprobada = true
      } else if (Math.random() < 0.1) {
        // 10% de liquidaciones rechazadas
        statusLiquidacion = 'Rechazado'
        liquidacionAprobada = false
      } else if (Math.random() < 0.3 && statusAnticipo === 'Pagado') {
        // 30% de liquidaciones pagadas (solo si el anticipo está pagado)
        statusLiquidacion = 'Pagado'
        liquidacionAprobada = true
      } else {
        // 25% de liquidaciones pendientes
        statusLiquidacion = 'Pendiente'
        liquidacionAprobada = false
      }
    } else {
      // Si no hay utilidad real, liquidación no aplica
      statusLiquidacion = 'N/A'
      liquidacionAprobada = false
    }
    
    // Liquidación = Comisión Total - Anticipo
    const comisionTotal = utilidadReal !== null ? utilidadReal * liquidacionPorcentaje : 0
    const liquidacionMonto = Math.max(0, comisionTotal - anticipoMonto)
    
    // Lógica de 5S Reviews: $2000 por 1 review, $500 extra por cada review adicional
    // Solo aplica al esquema nuevo
    let comision5S = 0
    let reviews5SCantidad = 0
    
    if (esEsquemaNuevo) {
      reviews5SCantidad = Math.floor(Math.random() * 4) // 0-3
      
      if (reviews5SCantidad === 1) {
        comision5S = 2000
      } else if (reviews5SCantidad === 2) {
        comision5S = 2500 // $2000 + $500
      } else if (reviews5SCantidad === 3) {
        comision5S = 3000 // $2000 + $500 + $500
      }
    }
    
    const comision5SPagada = comision5S > 0 ? comision5S * (Math.random() > 0.5 ? 1 : 0) : 0
    
    // Calcular por pagar - solo anticipos y liquidaciones APROBADOS (no pagados)
    const porPagar = (statusAnticipo === 'Aprobado' ? anticipoMonto : 0) + 
                     (statusLiquidacion === 'Aprobado' ? liquidacionMonto : 0)
    
    // Asegurar que Lisa Brissac sea el especialista para ~40% de los viajes
    const especialista = Math.random() < 0.4 ? 'Lisa Brissac' : especialistas[Math.floor(Math.random() * especialistas.length)]
    const rol = roles[Math.floor(Math.random() * roles.length)]
    
    viajes.push({
      id: `v_${i + 1}`,
      booking: `BK${String(i + 1).padStart(6, '0')}`,
      fechaVenta: fechaVenta.toISOString(),
      fechaViaje: fechaViaje.toISOString(),
      viajero: `Viajero ${i + 1}`,
      especialista,
      rol,
      apoyo: `Apoyo ${i + 1}`,
      reservas: `Reservas ${i + 1}`,
      seguimiento: `Seguimiento ${i + 1}`,
      tripbook: `Tripbook ${i + 1}`,
      utilidadCotizada,
      utilidadReal,
      ingresoCotizado,
      ingresoReal,
      cogsCotizados,
      cogsReales,
      comprador,
      nps: Math.floor(Math.random() * 10) + 1,
      diasViaje: Math.floor(Math.random() * 30) + 1,
      anticipo: {
        porcentaje: anticipoPorcentaje,
        monto: anticipoMonto,
        status: statusAnticipo,
        aprobado: anticipoAprobado,
        notaPospuesto: notaAnticipoPospuesto
      },
      liquidacion: {
        porcentaje: liquidacionPorcentaje,
        monto: liquidacionMonto,
        status: statusLiquidacion,
        aprobado: liquidacionAprobada,
        notaPospuesto: notaLiquidacionPospuesta
      },
      comisionTotal,
      reviews5S: {
        cantidad: reviews5SCantidad,
        fecha1: reviews5SCantidad > 0 ? new Date(fechaViaje.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        fecha2: reviews5SCantidad > 1 ? new Date(fechaViaje.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        fecha3: reviews5SCantidad > 2 ? new Date(fechaViaje.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        comision: comision5S,
        pagado: comision5SPagada,
        porPagar: comision5S - comision5SPagada
      },
      porPagar,
      ingresoMonedaOriginal,
      bonoManager: {
        aplica: aplicaBonoManager,
        porcentaje: porcentajeBonoManager,
        comision: comisionBonoManager,
        status: statusBonoManager,
        aprobado: bonoManagerAprobado,
        notaRechazo: notaBonoManagerRechazo,
        notaPospuesto: notaBonoManagerPospuesto
      }
    })
  }
  
  console.log(`Generados ${viajes.length} viajes`)
  console.log(`Viajes de Lisa Brissac: ${viajes.filter(v => v.especialista === 'Lisa Brissac').length}`)
  
  // Log de fechas generadas para debug
  const fechasUnicas = [...new Set(viajes.map(v => new Date(v.fechaVenta).getFullYear() + '-' + (new Date(v.fechaVenta).getMonth() + 1)))]
  console.log('📅 Fechas únicas generadas:', fechasUnicas.sort())
  
  return viajes
}

// Función para generar datos históricos mensuales
export function generateHistoricoMensual(): { mes: string; comisiones: number; anticipos: number; liquidaciones: number; reviews5S: number }[] {
  const historico = []
  const now = new Date()
  
  for (let i = 11; i >= 0; i--) {
    const fecha = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const mes = fecha.toLocaleString('es-MX', { month: 'long', year: 'numeric' })
    
    // Generar datos realistas para cada mes
    const baseComisiones = 150000 + Math.random() * 200000
    const variacion = 0.8 + Math.random() * 0.4 // ±20% variación
    
    const comisiones = Math.round(baseComisiones * variacion)
    const anticipos = Math.round(comisiones * 0.35) // ~35% del total
    const liquidaciones = Math.round(comisiones * 0.55) // ~55% del total
    const reviews5S = Math.round(comisiones * 0.10) // ~10% del total
    
    historico.push({
      mes,
      comisiones,
      anticipos,
      liquidaciones,
      reviews5S
    })
  }
  
  return historico
}

// Usuario por defecto - Lisa Brissac
export const seedUser: Usuario = {
  id: 'u_lisa',
  nombre: 'Lisa Brissac',
  rol: 'vendedor',
  email: 'lisa@empresa.com'
}

// Función para obtener highlights del período
export function getHighlightsPeriodo(mes: number, anio: number, user?: Usuario, filtroEspecialista?: string): HighlightsPeriodo {
  const first = new Date(anio, mes - 1, 1)
  const last = new Date(anio, mes, 0)
  
  const inRange = seedViajes().filter(v => {
    const d = new Date(v.fechaVenta)
    const byUser = user?.rol === 'vendedor' ? v.especialista === user.nombre : true
    const byEspecialista = filtroEspecialista ? v.especialista === filtroEspecialista : true
    return d >= first && d <= last && byUser && byEspecialista
  })
  
  const sumaComisionAnticipos = inRange.reduce((sum, v) => sum + (v.anticipo.status === 'Pagado' ? v.anticipo.monto : 0), 0)
  const numeroViajesVendidos = inRange.length
  const sumaComisionLiquidaciones = inRange.reduce((sum, v) => sum + (v.liquidacion.status === 'Pagado' ? v.liquidacion.monto : 0), 0)
  const numeroViajesOperados = inRange.filter(v => v.utilidadReal !== null).length
  const sumaComision5S = inRange.reduce((sum, v) => sum + v.reviews5S.comision, 0)
  const numeroReviews = inRange.reduce((sum, v) => sum + v.reviews5S.cantidad, 0)
  const totalComisiones = sumaComisionAnticipos + sumaComisionLiquidaciones + sumaComision5S
  
  return {
    sumaComisionAnticipos,
    numeroViajesVendidos,
    sumaComisionLiquidaciones,
    numeroViajesOperados,
    sumaComision5S,
    numeroReviews,
    totalComisiones
  }
}

// Función para obtener datos del Bono E
export function getBonoE(mes: number, anio: number, user?: Usuario, filtroEspecialista?: string): BonoE {
  const first = new Date(anio, mes - 1, 1)
  const last = new Date(anio, mes, 0)
  
  const inRange = seedViajes().filter(v => {
    const d = new Date(v.fechaVenta)
    const byUser = user?.rol === 'vendedor' ? v.especialista === user.nombre : true
    const byEspecialista = filtroEspecialista ? v.especialista === filtroEspecialista : true
    return d >= first && d <= last && byUser && byEspecialista
  })
  
  const numeroViajesVendidos = inRange.length
  const sumaUtilidadCotizada = inRange.reduce((sum, v) => sum + v.utilidadCotizada, 0)
  const sumaAnticipos = inRange.reduce((sum, v) => sum + v.anticipo.monto, 0)
  const numeroViajesOperados = inRange.filter(v => v.utilidadReal !== null).length
  const sumaUtilidadReal = inRange.reduce((sum, v) => sum + (v.utilidadReal || 0), 0)
  const sumaLiquidaciones = inRange.reduce((sum, v) => sum + v.liquidacion.monto, 0)
  
  // Calcular por pagar - solo anticipos y liquidaciones APROBADOS
  const porPagar = inRange.reduce((sum, v) => {
    const anticipoAprobado = v.anticipo.status === 'Aprobado' ? v.anticipo.monto : 0
    const liquidacionAprobada = v.liquidacion.status === 'Aprobado' ? v.liquidacion.monto : 0
    return sum + anticipoAprobado + liquidacionAprobada
  }, 0)
  
  return {
    numeroViajesVendidos,
    sumaUtilidadCotizada,
    sumaAnticipos,
    numeroViajesOperados,
    sumaUtilidadReal,
    sumaLiquidaciones,
    porPagar
  }
}

// Función para obtener datos del Bono 5S-E
export function getBono5SE(mes: number, anio: number, user?: Usuario, filtroEspecialista?: string): Bono5SE {
  const first = new Date(anio, mes - 1, 1)
  const last = new Date(anio, mes, 0)
  
  const inRange = seedViajes().filter(v => {
    const d = new Date(v.fechaVenta)
    const byUser = user?.rol === 'vendedor' ? v.especialista === user.nombre : true
    const byEspecialista = filtroEspecialista ? v.especialista === filtroEspecialista : true
    return d >= first && d <= last && byUser && byEspecialista
  })
  
  const viajesCon1Review = inRange.filter(v => v.reviews5S.cantidad === 1).length
  const viajesCon2Reviews = inRange.filter(v => v.reviews5S.cantidad === 2).length
  const viajesCon3Reviews = inRange.filter(v => v.reviews5S.cantidad >= 3).length
  const comisionTotal = inRange.reduce((sum, v) => sum + v.reviews5S.comision, 0)
  
  return {
    viajesCon1Review,
    viajesCon2Reviews,
    viajesCon3Reviews,
    comisionTotal
  }
}

// Función para obtener datos del Bono Manager
export function getBonoManager(mes: number, anio: number, user?: Usuario, filtroEspecialista?: string): BonoManager {
  const first = new Date(anio, mes - 1, 1)
  const last = new Date(anio, mes, 0)
  
  // Filtrar viajes del período donde aplica el bono manager
  const inRange = seedViajes().filter(v => {
    const d = new Date(v.fechaViaje) // Usar fecha de operación, no de venta
    const byUser = user?.rol === 'vendedor' ? v.especialista === user.nombre : true
    const byEspecialista = filtroEspecialista ? v.especialista === filtroEspecialista : true
    return d >= first && d <= last && byUser && byEspecialista && v.bonoManager.aplica
  })
  
  const numeroViajesOperados = inRange.length
  const sumaUtilidadReal = inRange.reduce((sum, v) => sum + (v.utilidadReal || 0), 0)
  const sumaComisionManager = inRange.reduce((sum, v) => sum + v.bonoManager.comision, 0)
  
  // Calcular por pagar - solo bonos manager aprobados
  const porPagar = inRange.reduce((sum, v) => {
    return sum + (v.bonoManager.status === 'Aprobado' ? v.bonoManager.comision : 0)
  }, 0)
  
  return {
    numeroViajesOperados,
    sumaUtilidadReal,
    sumaComisionManager,
    porPagar
  }
}

// Función para obtener histórico
export function getHistorico(user?: Usuario, filtroEspecialista?: string): Historico {
  const viajes = seedViajes().filter(v => {
    const byUser = user?.rol === 'vendedor' ? v.especialista === user.nombre : true
    const byEspecialista = filtroEspecialista ? v.especialista === filtroEspecialista : true
    return byUser && byEspecialista
  })
  
  const serie = viajes.map(v => ({
    dia: new Date(v.fechaVenta).getDate(),
    monto: v.porPagar
  }))
  
  return { serie }
}
