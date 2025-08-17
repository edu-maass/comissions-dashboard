import { useState, useEffect, useMemo } from 'react'
import { useSession } from '../state/useSession'
import { generateHistoricoMensual, seedViajes, getBonoManager } from '../lib/mockData'
import { fmtMXN } from '../lib/format'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts'
import CommissionDetailModal from '../components/CommissionDetailModal'
import CommissionsTable from '../components/CommissionsTable'
import Reviews5STable from '../components/Reviews5STable'
import BonoManagerTable from '../components/BonoManagerTable'
import ExportButton from '../components/ExportButton'
import type { Viaje, BonoManager } from '../lib/types'

export default function Historic() {
  const { user } = useSession()
  const [historicoMensual, setHistoricoMensual] = useState<{ mes: string; comisiones: number; anticipos: number; liquidaciones: number; reviews5S: number }[]>([])
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState<Viaje | null>(null)
  const [allViajes, setAllViajes] = useState<Viaje[]>([])
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>('')
  const [bonoManager, setBonoManager] = useState<BonoManager | null>(null)
  const [periodo, setPeriodo] = useState({ mes: new Date().getMonth() + 1, anio: new Date().getFullYear() })

  useEffect(() => {
    if (!user) return
    
    setLoading(true)
    // Generar datos históricos mensuales
    const historico = generateHistoricoMensual()
    setHistoricoMensual(historico)
    
    // Cargar viajes para calcular KPIs
    const viajes = seedViajes()
    setAllViajes(viajes)
    
    // Calcular Bono Manager para el período actual
    const bonoManagerData = getBonoManager(periodo.mes, periodo.anio, user)
    setBonoManager(bonoManagerData)
    
    setLoading(false)
  }, [user, periodo])

  // Función para actualizar un viaje
  const handleUpdateViaje = (viajeActualizado: Viaje) => {
    setAllViajes(prev => prev.map(v => v.id === viajeActualizado.id ? viajeActualizado : v))
    setDetail(null) // Cerrar el modal
  }

  // Calcular KPIs del período actual
  const calcularKPIs = useMemo(() => {
    const viajesFiltrados = allViajes.filter(v => {
      const fechaViaje = new Date(v.fechaViaje)
      const fechaVenta = new Date(v.fechaVenta)
      const mesSeleccionado = new Date(fechaSeleccionada)
      
      return fechaViaje.getMonth() === mesSeleccionado.getMonth() && 
             fechaViaje.getFullYear() === mesSeleccionado.getFullYear() ||
             fechaVenta.getMonth() === mesSeleccionado.getMonth() && 
             fechaVenta.getFullYear() === mesSeleccionado.getFullYear()
    })

    const anticipos = viajesFiltrados.reduce((sum, v) => sum + (v.anticipo.status === 'Pagado' ? v.anticipo.monto : 0), 0)
    const liquidaciones = viajesFiltrados.reduce((sum, v) => sum + (v.liquidacion.status === 'Pagado' ? v.liquidacion.monto : 0), 0)
    const numeroViajesVendidos = viajesFiltrados.length
    const numeroViajesOperados = viajesFiltrados.filter(v => v.utilidadReal !== null).length

    return {
      anticipos,
      liquidaciones,
      numeroViajesVendidos,
      numeroViajesOperados
    }
  }, [allViajes, fechaSeleccionada])

  const kpis = calcularKPIs

  if (loading) return <div className="text-center py-8">Cargando histórico...</div>
  
  if (!user) return <div className="text-center py-8">Por favor inicia sesión para ver el histórico</div>

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Histórico de Comisiones</h1>
        <p className="text-sm text-gray-600 mt-2">
          Evolución mensual de las comisiones, anticipos y liquidaciones
        </p>
      </div>

      {/* Gráfico de línea para tendencias */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Comisiones Totales</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicoMensual}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="mes" 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis />
              <Tooltip formatter={(value) => fmtMXN(value as number)} />
              <Line type="monotone" dataKey="comisiones" stroke="#3B82F6" strokeWidth={3} name="Total Comisiones" />
              <Line type="monotone" dataKey="anticipos" stroke="#10B981" strokeWidth={2} name="Anticipos" />
              <Line type="monotone" dataKey="liquidaciones" stroke="#F59E0B" strokeWidth={2} name="Liquidaciones" />
              <Line type="monotone" dataKey="reviews5S" stroke="#8B5CF6" strokeWidth={2} name="5S Reviews" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla de datos mensuales */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Detalle Mensual</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky-left-header bg-gray-50">
                  Mes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Comisiones
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Anticipos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Liquidaciones
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  5S Reviews
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {historicoMensual.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky-left bg-white">
                    {item.mes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                    {fmtMXN(item.comisiones)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    {fmtMXN(item.anticipos)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600">
                    {fmtMXN(item.liquidaciones)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600">
                    {fmtMXN(item.reviews5S)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bono Manager */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Bono Manager</h2>
        <p className="text-sm text-gray-600 mb-6">
          El bono manager se paga sobre utilidad real en el mes en que se opera el viaje en los que ellos NO SON ESPECIALISTAS pero que sí son parte del MERCADO GESTIONADO.
        </p>
        
        {/* KPIs en una línea */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="text-sm text-gray-600 font-medium mb-2">Bono Manager</div>
            <div className="text-4xl font-bold text-gray-900 mb-2">{bonoManager ? fmtMXN(bonoManager.sumaComisionManager) : 'N/A'}</div>
            <div className="text-sm text-gray-600">Total del período</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="text-sm text-gray-600 font-medium mb-2">Utilidad Real</div>
            <div className="text-4xl font-bold text-gray-900 mb-2">{bonoManager ? fmtMXN(bonoManager.sumaUtilidadReal) : 'N/A'}</div>
            <div className="text-sm text-gray-600">{bonoManager ? `${bonoManager.numeroViajesOperados} viajes operados` : 'N/A'}</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="text-sm text-gray-600 font-medium mb-2">Por Pagar</div>
            <div className="text-4xl font-bold text-gray-900 mb-2">{bonoManager ? fmtMXN(bonoManager.porPagar) : 'N/A'}</div>
            <div className="text-sm text-gray-600">Bonos aprobados</div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gráfico de pastel - Utilidad real por especialista */}
          <div className="h-80">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilidad Real por Especialista</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allViajes
                    .filter(v => v.bonoManager.aplica && v.utilidadReal !== null)
                    .reduce((acc, v) => {
                      const existing = acc.find(item => item.name === v.especialista)
                      if (existing) {
                        existing.value += v.utilidadReal || 0
                      } else {
                        acc.push({ name: v.especialista, value: v.utilidadReal || 0 })
                      }
                      return acc
                    }, [] as { name: string; value: number }[])
                    .slice(0, 8)} // Top 8 especialistas
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {allViajes
                    .filter(v => v.bonoManager.aplica && v.utilidadReal !== null)
                    .reduce((acc, v) => {
                      const existing = acc.find(item => item.name === v.especialista)
                      if (existing) {
                        existing.value += v.utilidadReal || 0
                      } else {
                        acc.push({ name: v.especialista, value: v.utilidadReal || 0 })
                      }
                      return acc
                    }, [] as { name: string; value: number }[])
                    .slice(0, 8)
                    .map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC0CB', '#DDA0DD'][index % 8]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value) => fmtMXN(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de línea - Histórico del bono manager */}
          <div className="h-80">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico del Bono Manager</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={useMemo(() => {
                // Generar datos históricos estables para el bono manager
                const historicoData = []
                for (let i = 11; i >= 0; i--) {
                  const d = new Date(periodo.anio, periodo.mes - 1 - i, 1)
                  const mesLabel = d.toLocaleDateString('es-MX', { month: 'short', year: '2-digit' })
                  
                  // Generar valor base estable con pequeña variación
                  const baseValue = 2500 + (Math.sin(i * 0.5) * 800) + (Math.random() * 400 - 200)
                  const valor = Math.round(Math.max(0, baseValue))
                  
                  historicoData.push({ mes: mesLabel, bono: valor })
                }
                return historicoData
              }, [periodo])}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => fmtMXN(value as number)} />
                <Line type="monotone" dataKey="bono" stroke="#8884d8" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabla del Bono Manager */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Resumen de Comisiones Manager</h3>
            <ExportButton
              rows={allViajes.filter(v => v.bonoManager.aplica).map(v => ({
                BKFI: v.booking,
                'Fecha Venta': new Date(v.fechaVenta).toLocaleDateString('es-MX'),
                'Fecha Operación': new Date(v.fechaViaje).toLocaleDateString('es-MX'),
                Viajero: v.viajero,
                'Utilidad Real': fmtMXN(v.utilidadReal || 0),
                'Comisión %': `${(v.bonoManager.porcentaje * 100).toFixed(1)}%`,
                'Comisión Total': fmtMXN(v.bonoManager.comision),
                'Status Bono Manager': v.bonoManager.status,
                'Por Pagar': fmtMXN(v.bonoManager.status === 'Aprobado' ? v.bonoManager.comision : 0)
              }))}
              filename="bono-manager-comisiones"
            />
          </div>

          <BonoManagerTable
            data={allViajes.filter(v => v.bonoManager.aplica)}
            onRowOpen={setDetail}
          />
        </div>
      </section>

      {/* Modal de detalle */}
      {detail && (
        <CommissionDetailModal
          viaje={detail}
          onClose={() => setDetail(null)}
          onUpdate={handleUpdateViaje}
          isAdmin={user?.rol === 'admin'}
        />
      )}
    </div>
  )
}
