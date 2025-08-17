import type { Viaje } from './types'

// Función para parsear el CSV y convertirlo a objetos Viaje
export function parseCSVToViajes(csvText: string): Viaje[] {
  const lines = csvText.split('\n')
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
  
  console.log('🔍 CSV Headers encontrados:', headers)
  
  // Mapeo de columnas del CSV según tu especificación
  const columnMap = {
    booking: headers.findIndex(h => h.includes('Booking')),
    viajero: headers.findIndex(h => h.includes('Lead Pax')),
    especialista: headers.findIndex(h => h.includes('Especialista')),
    apoyo: headers.findIndex(h => h.includes('Apoyo')),
    reservas: headers.findIndex(h => h.includes('Reservas')),
    seguimiento: headers.findIndex(h => h.includes('Seguimiento')),
    tripbook: headers.findIndex(h => h.includes('Tripbook')),
    fechaVenta: headers.findIndex(h => h.includes('Fecha de cierre')),
    fechaViaje: headers.findIndex(h => h.includes('Fecha en que comienza el viaje')),
    utilidadCotizada: headers.findIndex(h => h.includes('Utilidad cotizada MXN')),
    utilidadReal: headers.findIndex(h => h.includes('Utilidad Real Reporte')),
    nps: headers.findIndex(h => h.includes('NPS')),
    diasViaje: headers.findIndex(h => h.includes('Total de días de viaje')),
    anticipoPorcentaje: headers.findIndex(h => h.includes('Anticipo Especialista')),
    liquidacionTotal: headers.findIndex(h => h.includes('Pago Cierre de Viaje Especialista')),
    comisionPorcentaje: headers.findIndex(h => h.includes('Costo de comisión cotizado MXN')),
  }
  
  console.log('🔍 Mapeo de columnas:', columnMap)
  
  const viajes: Viaje[] = []
  
  // Procesar cada línea del CSV (saltando el header)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue
    
    // Parsear la línea considerando comas dentro de comillas
    const values = parseCSVLine(line)
    
    try {
      // Extraer valores según el mapeo
      const booking = values[columnMap.booking] || `BKFI${Math.floor(Math.random() * 99999) + 10000}`
      const viajero = values[columnMap.viajero] || 'Viajero N/A'
      const especialista = values[columnMap.especialista] || 'Especialista N/A'
      const apoyo = values[columnMap.apoyo] || ''
      const reservas = values[columnMap.reservas] || ''
      const seguimiento = values[columnMap.seguimiento] || ''
      const tripbook = values[columnMap.tripbook] || ''
      
      // Parsear fechas
      const fechaVenta = parseDate(values[columnMap.fechaVenta]) || new Date().toISOString()
      const fechaViaje = parseDate(values[columnMap.fechaViaje]) || new Date().toISOString()
      
      // Parsear números
      const utilidadCotizada = parseFloat(values[columnMap.utilidadCotizada]?.replace(/[^0-9.-]/g, '')) || 0
      const utilidadReal = parseFloat(values[columnMap.utilidadReal]?.replace(/[^0-9.-]/g, '')) || null
      const nps = parseInt(values[columnMap.nps]) || Math.floor(Math.random() * 10) + 1
      const diasViaje = parseInt(values[columnMap.diasViaje]) || Math.floor(Math.random() * 20) + 1
      
      // Calcular anticipos y liquidaciones
      const anticipoPorcentaje = 0.03 // 3% por defecto
      const anticipoMonto = Math.round(utilidadCotizada * anticipoPorcentaje)
      const statusAnticipo = Math.random() < 0.7 ? 'Pagado' : 'Pendiente'
      
      const liquidacionTotal = utilidadReal ? Math.round(utilidadReal * 0.04) : null
      const comisionPorcentaje = 0.05 // 5% por defecto
      const comisionTotal = utilidadReal ? Math.round(utilidadReal * comisionPorcentaje) : null
      
      // Generar datos de 5S Reviews
      const reviews5S = Math.floor(Math.random() * 4) // 0-3 reviews
      const fechaReview1 = reviews5S >= 1 ? new Date(fechaViaje).toISOString() : undefined
      const fechaReview2 = reviews5S >= 2 ? new Date(fechaViaje).toISOString() : undefined
      const fechaReview3 = reviews5S >= 3 ? new Date(fechaViaje).toISOString() : undefined
      
      const comision5S = reviews5S > 0 ? Math.round(utilidadCotizada * 0.01 * reviews5S) : null
      const comision5SPagada = Math.random() < 0.6 ? (comision5S || 0) : 0
      const comision5SPorPagar = (comision5S || 0) - comision5SPagada
      
      // Calcular por pagar
      const porPagar = (statusAnticipo === 'Pendiente' ? anticipoMonto : 0) + 
                       (liquidacionTotal && Math.random() < 0.3 ? liquidacionTotal : 0)
      
      const viaje: Viaje = {
        id: `csv_${i}`,
        booking: booking,
        fechaVenta: fechaVenta,
        fechaViaje: fechaViaje,
        viajero: viajero,
        especialista: especialista,
        rol: 'Especialista',
        apoyo: apoyo,
        reservas: reservas,
        seguimiento: seguimiento,
        tripbook: tripbook,
        utilidadCotizada: utilidadCotizada,
        utilidadReal: utilidadReal,
        ingresoCotizado: utilidadCotizada + (Math.random() * 100000 + 50000),
        ingresoReal: utilidadReal > 0 ? utilidadCotizada * (0.8 + Math.random() * 0.4) : 0,
        cogsCotizados: (utilidadCotizada + (Math.random() * 100000 + 50000)) - utilidadCotizada,
        cogsReales: utilidadReal > 0 ? (utilidadCotizada * (0.8 + Math.random() * 0.4)) - utilidadReal : 0,
        comprador: (['Evaneos Fr', 'Kim kim', 'Travel Local', 'Evaneos It', 'Tourlane'] as const)[Math.floor(Math.random() * 5)],
        ingresoMonedaOriginal: {
          monto: utilidadCotizada * (Math.random() > 0.5 ? 0.055 : 0.050),
          moneda: Math.random() > 0.5 ? 'USD' : 'EUR',
          tipoCambio: Math.random() > 0.5 ? 16.5 + Math.random() * 3 : 17.5 + Math.random() * 2
        },
        nps: nps,
        diasViaje: diasViaje,
        anticipo: {
          porcentaje: 0.02 + Math.random() * 0.015,
          monto: utilidadCotizada * (0.02 + Math.random() * 0.015) || Math.random() * 1000 + 100,
          status: Math.random() > 0.7 ? 'Pendiente' : 'Pagado',
          aprobado: Math.random() > 0.7,
          notaRechazo: undefined,
          notaPospuesto: undefined
        },
        liquidacion: {
          porcentaje: 0.04 + (Math.random() > 0.5 ? 0.01 : 0),
          monto: utilidadReal * (0.04 + (Math.random() > 0.5 ? 0.01 : 0)) || Math.random() * 1000 + 100,
          status: Math.random() > 0.6 ? 'Pendiente' : 'Pagado',
          aprobado: Math.random() > 0.6,
          notaRechazo: undefined,
          notaPospuesto: undefined
        },
        comisionTotal: comisionTotal,
        reviews5S: {
          cantidad: reviews5S,
          fecha1: reviews5S > 0 ? new Date().toISOString() : undefined,
          fecha2: reviews5S > 1 ? new Date().toISOString() : undefined,
          fecha3: reviews5S > 2 ? new Date().toISOString() : undefined,
          comision: comision5S,
          pagado: comision5SPagada,
          porPagar: comision5SPorPagar
        },
        porPagar,
        bonoManager: {
          aplica: false, // Por defecto no aplica para viajes importados
          porcentaje: 0.01,
          comision: 0,
          status: 'N/A' as const,
          aprobado: false,
          notaRechazo: undefined,
          notaPospuesto: undefined
        }
      }
      
      // Log de debug para las primeras 3 líneas
      if (i <= 3) {
        console.log(`📊 Línea ${i} parseada:`, {
          booking,
          viajero,
          especialista,
          fechaVenta: new Date(fechaVenta).toLocaleDateString(),
          utilidadCotizada,
          anticipoMonto,
          reviews5S
        })
      }
      
      viajes.push(viaje)
    } catch (error) {
      console.warn(`Error parsing line ${i}:`, error)
      continue
    }
  }
  
  console.log(`✅ CSV parsed successfully: ${viajes.length} viajes loaded`)
  
  // Mostrar distribución de fechas
  const fechasUnicas = [...new Set(viajes.map(v => new Date(v.fechaVenta).toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })))]
  console.log('📅 Fechas encontradas en el CSV:', fechasUnicas)
  
  return viajes
}

// Función para parsear líneas CSV considerando comas dentro de comillas
function parseCSVLine(line: string): string[] {
  const values: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  values.push(current.trim())
  return values
}

// Función para parsear fechas en formato DD/MM/YYYY
function parseDate(dateStr: string): string | null {
  if (!dateStr) return null
  
  try {
    // Formato esperado: DD/MM/YYYY
    const parts = dateStr.split('/')
    if (parts.length === 3) {
      const day = parseInt(parts[0])
      const month = parseInt(parts[1]) - 1 // Meses en JS son 0-based
      const year = parseInt(parts[2])
      
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month, day).toISOString()
      }
    }
  } catch (error) {
    console.warn('Error parsing date:', dateStr, error)
  }
  
  return null
}

// Función para cargar el CSV desde el archivo
export async function loadCSVData(): Promise<Viaje[]> {
  try {
    // Intentar cargar el CSV desde la carpeta public
    const response = await fetch('/Registro de viajes detallado.csv')
    if (!response.ok) {
      throw new Error('No se pudo cargar el CSV')
    }
    
    const csvText = await response.text()
    return parseCSVToViajes(csvText)
  } catch (error) {
    console.error('Error loading CSV:', error)
    console.log('Falling back to mock data...')
    
    // Si no se puede cargar el CSV, usar datos mock
    const { seedViajes } = await import('./mockData')
    return seedViajes()
  }
}
