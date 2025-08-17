// Tipos de usuario
export type Usuario = {
  id: string
  nombre: string
  rol: 'admin' | 'vendedor'
  email: string
}

// Estados de pago
export type EstatusPago = 'N/A' | 'Pendiente' | 'Aprobado' | 'Rechazado' | 'Pospuesto' | 'Pagado'

// Estructura de un viaje según el CSV
export type Viaje = {
  id: string
  booking: string
  fechaVenta: string
  fechaViaje: string
  viajero: string
  especialista: string
  rol: 'Especialista' | 'Apoyo' | 'Reservas' | 'Seguimiento' | 'Tripbook'
  apoyo: string
  reservas: string
  seguimiento: string
  tripbook: string
  utilidadCotizada: number
  utilidadReal: number
  nps: number
  diasViaje: number
  // Nuevos campos agregados
  ingresoCotizado: number
  ingresoReal: number
  cogsCotizados: number
  cogsReales: number
  comprador: 'Evaneos Fr' | 'Kim kim' | 'Travel Local' | 'Evaneos It' | 'Tourlane'
  ingresoMonedaOriginal: {
    monto: number
    moneda: 'USD' | 'EUR'
    tipoCambio: number
  }
  anticipo: {
    porcentaje: number
    monto: number
    status: EstatusPago
    aprobado?: boolean
    notaRechazo?: string
    notaPospuesto?: string
  }
  liquidacion: {
    porcentaje: number
    monto: number
    status: EstatusPago
    aprobado?: boolean
    notaRechazo?: string
    notaPospuesto?: string
  }
  comisionTotal: number
  reviews5S: {
    cantidad: number
    fecha1?: string
    fecha2?: string
    fecha3?: string
    comision: number
    pagado: number
    porPagar: number
  }
  porPagar: number
  // Campos de aprobación (removidos del nivel principal)
  // comisionAprobada?: boolean
  // notaComision?: string
  // bono5SAprobado?: boolean
  // notaBono5S?: string
}

// Resumen del período (Highlights)
export type HighlightsPeriodo = {
  sumaComisionAnticipos: number
  numeroViajesVendidos: number
  sumaComisionLiquidaciones: number
  numeroViajesOperados: number
  sumaComision5S: number
  numeroReviews: number
  totalComisiones: number
}

// Bono E - Datos principales
export type BonoE = {
  numeroViajesVendidos: number
  sumaUtilidadCotizada: number
  sumaAnticipos: number
  numeroViajesOperados: number
  sumaUtilidadReal: number
  sumaLiquidaciones: number
  porPagar: number
}

// Bono 5S-E - Reviews
export type Bono5SE = {
  viajesCon1Review: number
  viajesCon2Reviews: number
  viajesCon3Reviews: number
  comisionTotal: number
}

// Histórico mensual
export type HistoricoMes = {
  anio: number
  mes: number
  total: number
  serie: { dia: number; monto: number }[]
}

// Histórico general
export type Historico = {
  serie: { dia: number; monto: number }[]
}

export type Filters = {
  especialista?: string
  rol?: 'Especialista' | 'Apoyo' | 'Reservas' | 'Seguimiento' | 'Tripbook'
  statusLiquidacion?: 'Pagada' | 'Pendiente'
  tipoViaje?: 'anticipo' | 'liquidacion' | 'todos'
  q?: string
}
