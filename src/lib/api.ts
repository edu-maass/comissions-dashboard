import type { Viaje, HighlightsPeriodo, BonoE, Bono5SE, Historico, Usuario } from './types'
import { seedViajes, getHighlightsPeriodo, getBonoE, getBono5SE, getHistorico } from './mockData'

// API mock para desarrollo
const api = {
  // Obtener usuario actual
  me: async (): Promise<Usuario> => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 100))
    return {
      id: 'u_123',
      nombre: 'Eduardo',
      rol: 'vendedor',
      email: 'edu@empresa.com'
    }
  },

  // Obtener viajes con filtros
  viajes: async (params: Record<string, string>): Promise<{ rows: Viaje[]; total: number }> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const q = params.q || ''
    const especialista = params.especialista || ''
    const from = params.from || ''
    const to = params.to || ''
    const page = parseInt(params.page || '1')
    const size = parseInt(params.size || '50')
    const sort = params.sort || 'fechaVenta:desc'

    let filtered = seedViajes()

    // Filtro por búsqueda
    if (q) {
      filtered = filtered.filter(v => 
        v.booking.toLowerCase().includes(q.toLowerCase()) ||
        v.viajero.toLowerCase().includes(q.toLowerCase()) ||
        v.especialista.toLowerCase().includes(q.toLowerCase())
      )
    }

    // Filtro por especialista
    if (especialista) {
      filtered = filtered.filter(v => v.especialista === especialista)
    }

    // Filtro por rango de fechas
    if (from || to) {
      filtered = filtered.filter(v => {
        const fecha = new Date(v.fechaVenta)
        const fromDate = from ? new Date(from) : null
        const toDate = to ? new Date(to) : null
        
        if (fromDate && fecha < fromDate) return false
        if (toDate && fecha > toDate) return false
        return true
      })
    }

    // Ordenamiento
    if (sort === 'fechaVenta:desc') {
      filtered.sort((a, b) => new Date(b.fechaVenta).getTime() - new Date(a.fechaVenta).getTime())
    }

    const total = filtered.length
    const start = (page - 1) * size
    const end = start + size
    const rows = filtered.slice(start, end)

    return { rows, total }
  },

  // Obtener highlights del período
  highlightsPeriodo: async (mes: number, anio: number): Promise<HighlightsPeriodo> => {
    await new Promise(resolve => setTimeout(resolve, 150))
    return getHighlightsPeriodo(mes, anio)
  },

  // Obtener datos del Bono E
  bonoE: async (mes: number, anio: number): Promise<BonoE> => {
    await new Promise(resolve => setTimeout(resolve, 150))
    return getBonoE(mes, anio)
  },

  // Obtener datos del Bono 5S-E
  bono5SE: async (mes: number, anio: number): Promise<Bono5SE> => {
    await new Promise(resolve => setTimeout(resolve, 150))
    return getBono5SE(mes, anio)
  },

  // Obtener detalle de un viaje
  detalle: async (id: string): Promise<Viaje> => {
    await new Promise(resolve => setTimeout(resolve, 100))
    const viaje = seedViajes().find(v => v.id === id)
    if (!viaje) {
      throw new Error('Viaje no encontrado')
    }
    return viaje
  },

  // Marcar como pagado
  marcarPagado: async (id: string, fechaPago: string): Promise<{ ok: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    // En una app real, aquí se actualizaría la base de datos
    console.log(`Marcando como pagado: ${id} en ${fechaPago}`)
    return { ok: true }
  },

  // Obtener histórico
  async getHistorico(user?: Usuario, filtroEspecialista?: string): Promise<Historico> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(getHistorico(user, filtroEspecialista))
      }, 100)
    })
  }
}

export default api
