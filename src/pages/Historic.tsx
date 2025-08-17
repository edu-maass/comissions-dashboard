import { useState, useEffect, useMemo } from 'react'
import { useSession } from '../state/useSession'
import { generateHistoricoMensual, seedViajes } from '../lib/mockData'
import { fmtMXN } from '../lib/format'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts'
import CommissionDetailModal from '../components/CommissionDetailModal'
import CommissionsTable from '../components/CommissionsTable'
import Reviews5STable from '../components/Reviews5STable'
import type { Viaje } from '../lib/types'

export default function Historic() {
  const { user } = useSession()
  const [historicoMensual, setHistoricoMensual] = useState<{ mes: string; comisiones: number; anticipos: number; liquidaciones: number; reviews5S: number }[]>([])
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState<Viaje | null>(null)
  const [allViajes, setAllViajes] = useState<Viaje[]>([])
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>('')

  useEffect(() => {
    if (!user) return
    
    setLoading(true)
    // Generar datos históricos mensuales
    const historico = generateHistoricoMensual()
    setHistoricoMensual(historico)
    
    // Cargar viajes para calcular KPIs
    const viajes = seedViajes()
    setAllViajes(viajes)
    setLoading(false)
  }, [user])

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
