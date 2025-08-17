import React, { useState, useEffect, useMemo } from 'react'
import { useSession } from '../state/useSession'
import type { Viaje, HighlightsPeriodo, BonoE, Bono5SE, Filters } from '../lib/types'
import CommissionDetailModal from '../components/CommissionDetailModal'
import CommissionsTable from '../components/CommissionsTable'
import Reviews5STable from '../components/Reviews5STable'
import ExportButton from '../components/ExportButton'
import { seedViajes, generateHistoricoMensual } from '../lib/mockData'
import { fmtMXN } from '../lib/format'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts'
import KpiCard from '../components/KpiCard'
import MonthPicker from '../components/MonthPicker'
import FiltersBar from '../components/FiltersBar'
import Sparkline from '../components/Sparkline'

export default function Dashboard() {
  const { user } = useSession()
  const now = new Date()
  // Corregir el estado inicial del período - usar mes actual (1-12) y año actual
  const [periodo, setPeriodo] = useState({ 
    mes: now.getMonth() + 1, // getMonth() retorna 0-11, queremos 1-12
    anio: now.getFullYear() 
  })
  
  // Función para manejar cambios en el período
  const handlePeriodoChange = (nuevoPeriodo: { mes: number; anio: number }) => {
    console.log('🔄 Cambiando período de', periodo, 'a', nuevoPeriodo)
    setPeriodo(nuevoPeriodo)
  }
  const [filters, setFilters] = useState<Filters>({
    especialista: '',
    rol: undefined,
    statusLiquidacion: undefined,
    tipoViaje: 'todos',
    q: ''
  })
  const [allViajes, setAllViajes] = useState<Viaje[]>([])
  const [rows, setRows] = useState<Viaje[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [highlights, setHighlights] = useState<HighlightsPeriodo | null>(null)
  const [bonoE, setBonoE] = useState<BonoE | null>(null)
  const [bono5SE, setBono5SE] = useState<Bono5SE | null>(null)
  const [historicoMensual, setHistoricoMensual] = useState<{ mes: string; comisiones: number; anticipos: number; liquidaciones: number; reviews5S: number }[]>([])
  const [detail, setDetail] = useState<Viaje | null>(null)

  // Función para actualizar un viaje
  const handleUpdateViaje = (viajeActualizado: Viaje) => {
    setAllViajes(prev => prev.map(v => v.id === viajeActualizado.id ? viajeActualizado : v))
    setDetail(null) // Cerrar el modal
  }

  console.log('🔍 Dashboard renderizando, user:', user)
  console.log('🔍 Estado inicial - allViajes:', allViajes.length)
  console.log('🔍 Estado inicial - highlights:', highlights)
  console.log('🔍 Estado inicial - loading:', loading)
  console.log('🔍 Estado inicial - periodo:', periodo)

  const pageSize = 200

  // Cargar datos mock al montar el componente
  useEffect(() => {
    console.log('🔄 useEffect de carga de datos ejecutándose...')
    const loadData = async () => {
      setLoading(true)
      try {
        console.log('🔄 Loading mock data...')
        console.log('🔄 Llamando a seedViajes()...')
        
        // Crear datos de prueba simples primero
        const testViajes = [
          {
            id: 'test_1',
            booking: 'BK000001',
            fechaVenta: new Date(2024, 8, 15).toISOString(), // Septiembre 2024
            fechaViaje: new Date(2024, 9, 20).toISOString(),
            viajero: 'Viajero Test 1',
            especialista: 'Lisa Brissac',
            rol: 'Especialista' as const,
            apoyo: 'Apoyo Test 1',
            reservas: 'Reservas Test 1',
            seguimiento: 'Seguimiento Test 1',
            tripbook: 'Tripbook Test 1',
            utilidadCotizada: 25000,
            utilidadReal: 22000,
            ingresoCotizado: 150000,
            ingresoReal: 140000,
            cogsCotizados: 125000,
            cogsReales: 118000,
            comprador: 'Evaneos Fr' as const,
            ingresoMonedaOriginal: {
              monto: 7500,
              moneda: 'USD' as const,
              tipoCambio: 18.5
            },
            nps: 8,
            diasViaje: 7,
            anticipo: {
              porcentaje: 0.025,
              monto: 625,
              status: 'Pagado' as const,
              aprobado: true,
              notaRechazo: undefined,
              notaPospuesto: undefined
            },
            liquidacion: {
              porcentaje: 0.04,
              monto: 880,
              status: 'Pagado' as const,
              aprobado: true,
              notaRechazo: undefined,
              notaPospuesto: undefined
            },
            comisionTotal: 880,
            reviews5S: {
              cantidad: 2,
              fecha1: new Date(2024, 9, 25).toISOString(),
              fecha2: new Date(2024, 9, 30).toISOString(),
              comision: 500,
              pagado: 300,
              porPagar: 200
            },
            porPagar: 1505
          }
        ]
        
        console.log('🔄 Datos de prueba creados:', testViajes)
        
        // Intentar usar seedViajes() original
        let viajes
        try {
          viajes = seedViajes()
          console.log('🔄 seedViajes() original funcionó, retornó:', viajes.length, 'viajes')
        } catch (seedError) {
          console.warn('⚠️ seedViajes() falló, usando datos de prueba:', seedError)
          viajes = testViajes
        }
        
        console.log('🔄 Tipo de viajes:', typeof viajes)
        console.log('🔄 Es array:', Array.isArray(viajes))
        console.log('🔄 Longitud:', viajes?.length)
        
        if (viajes && Array.isArray(viajes) && viajes.length > 0) {
          setAllViajes(viajes)
          console.log(`✅ Loaded ${viajes.length} viajes`)
          console.log('✅ Primer viaje:', viajes[0])
        } else {
          console.error('❌ No hay datos válidos, usando datos de prueba')
          setAllViajes(testViajes)
        }
        
        // Cargar histórico mensual
        const historico = generateHistoricoMensual()
        setHistoricoMensual(historico)
        console.log('✅ Histórico mensual cargado:', historico.length, 'meses')
      } catch (error) {
        console.error('❌ Error loading mock data:', error)
        console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
      } finally {
        setLoading(false)
        console.log('🔄 Loading completado, setLoading(false)')
      }
    }
    
    loadData()
  }, [])

  // Filtrar viajes por período seleccionado
  const filteredViajes = useMemo(() => {
    console.log('🔄 Filtrando viajes...')
    console.log('🔄 allViajes.length:', allViajes.length)
    console.log('🔄 periodo seleccionado:', periodo)
    
    if (allViajes.length === 0) {
      console.log('⚠️ No hay viajes para filtrar')
      return []
    }
    
    let filtered = allViajes
    
    // Filtro por período: solo viajes con fecha de viaje O fecha de venta en el mes seleccionado
    const filteredByPeriod = filtered.filter(v => {
      const fechaViaje = new Date(v.fechaViaje)
      const fechaVenta = new Date(v.fechaVenta)
      
      // Debug: mostrar fechas del viaje
      if (v.id === 'test_1') {
        console.log('🔍 Viaje test_1:', {
          id: v.id,
          fechaViaje: fechaViaje.toISOString(),
          fechaVenta: fechaVenta.toISOString(),
          periodo: periodo,
          mesSeleccionado: `${periodo.mes}/${periodo.anio}`
        })
      }
      
      // Verificar si la fecha de viaje o fecha de venta está en el mes seleccionado
      const viajeEnMes = fechaViaje.getMonth() + 1 === periodo.mes && 
                         fechaViaje.getFullYear() === periodo.anio
      const ventaEnMes = fechaVenta.getMonth() + 1 === periodo.mes && 
                         fechaVenta.getFullYear() === periodo.anio
      
      const incluir = viajeEnMes || ventaEnMes
      
      if (v.id === 'test_1') {
        console.log('🔍 Resultado filtro:', {
          viajeEnMes,
          ventaEnMes,
          incluir
        })
      }
      
      return incluir
    })
    
    console.log(`🔍 Después de filtro período: ${filteredByPeriod.length} viajes`)
    console.log(`🔍 Viajes filtrados:`, filteredByPeriod.map(v => ({
      id: v.id,
      booking: v.booking,
      fechaVenta: new Date(v.fechaVenta).toLocaleDateString(),
      fechaViaje: new Date(v.fechaViaje).toLocaleDateString()
    })))
    
    if (filteredByPeriod.length === 0) {
      console.log(`⚠️ No hay datos para ${periodo.mes}/${periodo.anio}, mostrando datos recientes`)
      // Mostrar datos de los últimos 6 meses como fallback
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      filtered = filtered.filter(v => new Date(v.fechaVenta) >= sixMonthsAgo)
      console.log(`🔍 Después de fallback a datos recientes: ${filtered.length} viajes`)
      
      // Si aún no hay datos, mostrar todos los datos
      if (filtered.length === 0) {
        console.log('⚠️ No hay datos recientes, mostrando todos los datos disponibles')
        filtered = allViajes
      }
    } else {
      filtered = filteredByPeriod
      console.log(`🔍 Después de filtro período: ${filtered.length} viajes`)
    }

    // Filtro por especialista
    if (filters.especialista) {
      filtered = filtered.filter(v => v.especialista.toLowerCase().includes(filters.especialista!.toLowerCase()))
      console.log(`🔍 Después de filtro especialista: ${filtered.length} viajes`)
    }

    // Filtro por rol
    if (filters.rol) {
      filtered = filtered.filter(v => v.rol === filters.rol)
      console.log(`🔍 Después de filtro rol: ${filtered.length} viajes`)
    }

    // Filtro por status de liquidación
    if (filters.statusLiquidacion) {
      filtered = filtered.filter(v => v.liquidacion.status === filters.statusLiquidacion)
      console.log(`🔍 Después de filtro status: ${filtered.length} viajes`)
    }

    // Filtro por tipo de viaje
    if (filters.tipoViaje === 'anticipo') {
      filtered = filtered.filter(v => v.anticipo.status === 'Pendiente')
    } else if (filters.tipoViaje === 'liquidacion') {
      filtered = filtered.filter(v => v.liquidacion.status === 'Pendiente')
    }

    // Filtro por búsqueda
    if (filters.q) {
      const query = filters.q.toLowerCase()
      filtered = filtered.filter(v => 
        v.booking.toLowerCase().includes(query) ||
        v.viajero.toLowerCase().includes(query) ||
        v.especialista.toLowerCase().includes(query)
      )
      console.log(`🔍 Después de filtro búsqueda: ${filtered.length} viajes`)
    }

    console.log(`🔍 Total final filtrado: ${filtered.length} viajes`)
    return filtered
  }, [allViajes, filters, periodo])

  // Calcular datos cuando cambien los filtros o el período
  useEffect(() => {
    console.log('🔄 useEffect de filtrado ejecutándose...')
    console.log('🔄 allViajes.length:', allViajes.length)
    console.log('🔄 filteredViajes.length:', filteredViajes.length)
    
    if (allViajes.length === 0) {
      console.log('⚠️ No hay viajes para procesar, saliendo del useEffect')
      return
    }
    
    // Ordenar por fecha de venta descendente
    const sortedViajes = [...filteredViajes].sort((a, b) => new Date(b.fechaVenta).getTime() - new Date(a.fechaVenta).getTime())
    
    // Paginar
    const start = 0
    const end = Math.min(pageSize, sortedViajes.length)
    const paginatedViajes = sortedViajes.slice(start, end)
    
    setRows(paginatedViajes)
    setTotal(sortedViajes.length)
    
    // Calcular highlights
    const highlightsData = calculateHighlights(sortedViajes)
    setHighlights(highlightsData)
    
    // Calcular Bono E
    const bonoEData = calculateBonoE(sortedViajes)
    setBonoE(bonoEData)
    
    // Calcular Bono 5S-E
    const bono5SEData = calculateBono5SE(sortedViajes)
    setBono5SE(bono5SEData)
    
    console.log('✅ Datos calculados y actualizados')
    console.log('✅ highlights:', highlightsData)
    console.log('✅ bonoE:', bonoEData)
    console.log('✅ bono5SE:', bono5SEData)
    
  }, [filteredViajes, pageSize])

  // Monitorear cambios en los estados principales
  useEffect(() => {
    console.log('🔄 Estado allViajes cambió:', allViajes.length)
  }, [allViajes])

  useEffect(() => {
    console.log('🔄 Estado highlights cambió:', highlights)
  }, [highlights])

  useEffect(() => {
    console.log('🔄 Estado bonoE cambió:', bonoE)
  }, [bonoE])

  useEffect(() => {
    console.log('🔄 Estado bono5SE cambió:', bono5SE)
  }, [bono5SE])

  useEffect(() => {
    console.log('🔄 Estado loading cambió:', loading)
  }, [loading])

  // Calcular highlights del período
  const calculateHighlights = (viajes: Viaje[]): HighlightsPeriodo => {
    const sumaComisionAnticipos = viajes.reduce((sum, v) => sum + (v.anticipo.status === 'Pagado' ? v.anticipo.monto : 0), 0)
    const numeroViajesVendidos = viajes.length
    const sumaComisionLiquidaciones = viajes.reduce((sum, v) => sum + (v.liquidacion.status === 'Pagado' ? v.liquidacion.monto : 0), 0)
    const numeroViajesOperados = viajes.filter(v => v.utilidadReal > 0).length
    const sumaComision5S = viajes.reduce((sum, v) => sum + v.reviews5S.comision, 0)
    const numeroReviews = viajes.reduce((sum, v) => sum + v.reviews5S.cantidad, 0)
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

  // Calcular Bono E
  const calculateBonoE = (viajes: Viaje[]): BonoE => {
    const numeroViajesVendidos = viajes.length
    const sumaUtilidadCotizada = viajes.reduce((sum, v) => sum + v.utilidadCotizada, 0)
    const sumaAnticipos = viajes.reduce((sum, v) => sum + v.anticipo.monto, 0)
    const numeroViajesOperados = viajes.filter(v => v.utilidadReal > 0).length
    const sumaUtilidadReal = viajes.reduce((sum, v) => sum + v.utilidadReal, 0)
    const sumaLiquidaciones = viajes.reduce((sum, v) => sum + v.liquidacion.monto, 0)
    
    return {
      numeroViajesVendidos,
      sumaUtilidadCotizada,
      sumaAnticipos,
      numeroViajesOperados,
      sumaUtilidadReal,
      sumaLiquidaciones
    }
  }

  // Calcular Bono 5S-E
  const calculateBono5SE = (viajes: Viaje[]): Bono5SE => {
    const viajesCon1Review = viajes.filter(v => v.reviews5S.cantidad === 1).length
    const viajesCon2Reviews = viajes.filter(v => v.reviews5S.cantidad === 2).length
    const viajesCon3Reviews = viajes.filter(v => v.reviews5S.cantidad >= 3).length
    const comisionTotal = viajes.reduce((sum, v) => sum + v.reviews5S.comision, 0)
    
    return {
      viajesCon1Review,
      viajesCon2Reviews,
      viajesCon3Reviews,
      comisionTotal
    }
  }

  // KPIs del período
  const kpis = highlights ? [
    { title: 'Total Anticipos (MXN)', value: fmtMXN(highlights.sumaComisionAnticipos), subtitle: `${highlights.numeroViajesVendidos} viajes vendidos` },
    { title: 'Total Liquidaciones (MXN)', value: fmtMXN(highlights.sumaComisionLiquidaciones), subtitle: `${highlights.numeroViajesOperados} viajes operados` },
    { title: 'Total Comisión 5S (MXN)', value: fmtMXN(highlights.sumaComision5S), subtitle: `${highlights.numeroReviews} reviews` },
    { title: 'Total General (MXN)', value: fmtMXN(highlights.totalComisiones), subtitle: 'Suma de todos los conceptos' },
  ] : []

  // Datos para gráficos
  const chartData = React.useMemo(() => {
    if (!highlights) return []
    const months = Array.from({ length: 12 }).map((_, i) => {
      const d = new Date(periodo.anio, periodo.mes - 1 - (11 - i), 1)
      const label = `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getFullYear()).slice(-2)}`
      const val = Math.round(Math.random() * 40000 + 5000)
      const est = i === 11 ? Math.round(val * 1.05) : null
      return { label, real: val, est }
    })
    return months
  }, [periodo, highlights])



  // Datos para gráfico de Bono 5S-E
  const bono5SEChartData = React.useMemo(() => {
    if (!bono5SE) return []
    return [
      { name: '1 Review', value: bono5SE.viajesCon1Review, comision: bono5SE.comisionTotal * 0.25 },
      { name: '2 Reviews', value: bono5SE.viajesCon2Reviews, comision: bono5SE.comisionTotal * 0.35 },
      { name: '3+ Reviews', value: bono5SE.viajesCon3Reviews, comision: bono5SE.comisionTotal * 0.4 },
    ]
  }, [bono5SE])

  const pieChartData = React.useMemo(() => {
    if (!highlights) return []
    return [
      { name: 'Anticipos', value: highlights.sumaComisionAnticipos, color: '#3B82F6' },
      { name: 'Liquidaciones', value: highlights.sumaComisionLiquidaciones, color: '#10B981' },
      { name: '5S Reviews', value: highlights.sumaComision5S, color: '#F59E0B' },
    ]
  }, [highlights])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard de Comisiones</h2>
          <p className="text-sm text-gray-600 mt-1">
            Período: {periodo.mes === 8 ? 'AGOSTO' : 'OTRO MES'} {periodo.anio} 
            | Viajes mostrados: {filteredViajes.length} 
            | Total disponible: {allViajes.length}
          </p>
        </div>
        <MonthPicker value={periodo} onChange={handlePeriodoChange} />
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="text-center py-8">
          <div className="text-lg text-gray-600">Cargando datos del dashboard...</div>
        </div>
      ) : !highlights || !bonoE || !bono5SE ? (
        <div className="text-center py-8">
          <div className="text-lg text-gray-600">No hay datos disponibles para este período</div>
          <div className="text-sm text-gray-500 mt-2">
            Intenta cambiar el período. Los datos están distribuidos en los últimos 14 meses.
          </div>
        </div>
      ) : (
        <>
          {/* Highlights Section - Resumen del Período */}
          <section className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen del Período</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {kpis.map((kpi, i) => (
                <KpiCard key={i} title={kpi.title} value={kpi.value} subtitle={kpi.subtitle} />
              ))}
            </div>
            {/* Gráficos lado a lado */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              {/* Gráfico de Pie */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Comisiones</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => fmtMXN(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Gráfica Histórica Mensual */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico Mensual de Comisiones</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={historicoMensual}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="mes" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                      tickFormatter={(value) => {
                        // Convertir "septiembre de 2024" a "sep-24"
                        const monthMap: { [key: string]: string } = {
                          'enero': 'ene', 'febrero': 'feb', 'marzo': 'mar', 'abril': 'abr',
                          'mayo': 'may', 'junio': 'jun', 'julio': 'jul', 'agosto': 'ago',
                          'septiembre': 'sep', 'octubre': 'oct', 'noviembre': 'nov', 'diciembre': 'dic'
                        };
                        
                        const parts = value.split(' de ');
                        if (parts.length === 2) {
                          const month = monthMap[parts[0].toLowerCase()] || parts[0].substring(0, 3);
                          const year = parts[1].substring(2); // Tomar solo los últimos 2 dígitos del año
                          return `${month}-${year}`;
                        }
                        return value;
                      }}
                    />
                    <YAxis />
                    <Tooltip formatter={(value) => fmtMXN(value as number)} />
                    <Legend />
                    <Bar dataKey="anticipos" stackId="a" fill="#10B981" name="Anticipos" />
                    <Bar dataKey="liquidaciones" stackId="a" fill="#F59E0B" name="Liquidaciones" />
                    <Bar dataKey="reviews5S" stackId="a" fill="#8B5CF6" name="5S Reviews" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Bono E - Datos Principales */}
          <section className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Bono E - Datos Principales</h2>
            
            {/* Todos los KPIs en una sola fila */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* KPI Card - Utilidad Cotizada */}
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="text-sm text-gray-600 font-medium mb-2">Utilidad Cotizada (MXN)</div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{Math.round(bonoE.sumaUtilidadCotizada).toLocaleString()}</div>
                <div className="text-sm text-gray-600">{bonoE.numeroViajesVendidos} viajes vendidos</div>
              </div>
              
              {/* KPI Card - Anticipos */}
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="text-sm text-gray-600 font-medium mb-2">Anticipos (MXN)</div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{Math.round(bonoE.sumaAnticipos).toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total del período</div>
              </div>
              
              {/* KPI Card - Utilidad Real */}
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="text-sm text-gray-600 font-medium mb-2">Utilidad Real (MXN)</div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{Math.round(bonoE.sumaUtilidadReal).toLocaleString()}</div>
                <div className="text-sm text-gray-600">{bonoE.numeroViajesOperados} viajes operados</div>
              </div>
              
              {/* KPI Card - Liquidaciones */}
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="text-sm text-gray-600 font-medium mb-2">Liquidaciones (MXN)</div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{Math.round(bonoE.sumaLiquidaciones).toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total del período</div>
              </div>
            </div>

            {/* Tabla de viajes integrada */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Detalle de Viajes del Período</h3>
                <ExportButton rows={rows} filename="viajes-comisiones" />
              </div>

              {/* Filtros arriba de la tabla */}
              <div className="mb-6">
                <FiltersBar value={filters} onChange={setFilters} isAdmin={user?.rol === 'admin'} />
              </div>

              {rows.length === 0 ? (
                <div className="bg-gray-50 p-8 text-center rounded-lg border border-gray-200">
                  <div className="text-lg text-gray-600">No se encontraron viajes en este período</div>
                  <div className="text-sm text-gray-500 mt-2">
                    Intenta cambiar el período o los filtros. Los datos están distribuidos en los últimos 14 meses.
                  </div>
                </div>
              ) : (
                <CommissionsTable data={rows} onRowOpen={setDetail} />
              )}
            </div>
          </section>

          {/* Bono 5S-E - Reviews */}
          <section className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Bono 5S-E - Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="text-sm text-yellow-600 font-medium">1 Review</div>
                <div className="text-3xl font-bold text-yellow-900">{bono5SE.viajesCon1Review}</div>
                <div className="text-sm text-yellow-700 font-medium">{fmtMXN(bono5SE.comisionTotal * 0.25)}</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="text-sm text-orange-600 font-medium">2 Reviews</div>
                <div className="text-3xl font-bold text-orange-900">{bono5SE.viajesCon2Reviews}</div>
                <div className="text-sm text-orange-700 font-medium">{fmtMXN(bono5SE.comisionTotal * 0.35)}</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="text-sm text-red-600 font-medium">3+ Reviews</div>
                <div className="text-3xl font-bold text-red-900">{bono5SE.viajesCon3Reviews}</div>
                <div className="text-sm text-red-700 font-medium">{fmtMXN(bono5SE.comisionTotal * 0.4)}</div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bono5SEChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => fmtMXN(value as number)} />
                  <Bar dataKey="comision" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Tabla de 5S Reviews */}
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Viajes con 5S Reviews</h3>
                <ExportButton
                  rows={filteredViajes.filter(v => v.reviews5S.cantidad > 0).map(v => ({
                    Booking: v.booking,
                    Viajero: v.viajero,
                    'Fecha de Viaje': new Date(v.fechaViaje).toLocaleDateString('es-MX'),
                    NPS: v.nps,
                    '5S Reviews': v.reviews5S.cantidad,
                    'Fecha Reseña 1': v.reviews5S.fecha1 ? new Date(v.reviews5S.fecha1).toLocaleDateString('es-MX') : '-',
                    'Fecha Reseña 2': v.reviews5S.fecha2 ? new Date(v.reviews5S.fecha2).toLocaleDateString('es-MX') : '-',
                    'Fecha Reseña 3': v.reviews5S.fecha3 ? new Date(v.reviews5S.fecha3).toLocaleDateString('es-MX') : '-',
                    'Comisión Total': fmtMXN(v.reviews5S.comision),
                    'Comisión Pagada': fmtMXN(v.reviews5S.pagado),
                    'Comisión por Pagar': fmtMXN(v.reviews5S.porPagar)
                  }))}
                  filename="viajes-5s-reviews"
                />
              </div>

              <Reviews5STable
                data={filteredViajes.filter(v => v.reviews5S.cantidad > 0)}
                onRowOpen={setDetail}
              />
            </div>
          </section>
        </>
      )}

      {/* Modal de detalle */}
      {detail && (
        <CommissionDetailModal
          viaje={detail}
          onClose={() => setDetail(null)}
          onUpdate={handleUpdateViaje}
        />
      )}
    </div>
  )
}
