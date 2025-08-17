import { useState } from 'react'
import type { Viaje } from '../lib/types'
import { fmtMXN } from '../lib/format'

interface Props {
  viaje: Viaje | null
  onClose: () => void
  onUpdate?: (viaje: Viaje) => void
  isAdmin?: boolean // Prop para identificar si el usuario es administrador
}

export default function CommissionDetailModal({ viaje, onClose, onUpdate, isAdmin = false }: Props) {
  const [notaAnticipo, setNotaAnticipo] = useState(viaje?.anticipo.notaRechazo || '')
  const [notaLiquidacion, setNotaLiquidacion] = useState(viaje?.liquidacion.notaRechazo || '')
  const [notaAnticipoPospuesto, setNotaAnticipoPospuesto] = useState(viaje?.anticipo.notaPospuesto || '')
  const [notaLiquidacionPospuesta, setNotaLiquidacionPospuesta] = useState(viaje?.liquidacion.notaPospuesto || '')
  const [showNotaAnticipo, setShowNotaAnticipo] = useState(false)
  const [showNotaLiquidacion, setShowNotaLiquidacion] = useState(false)
  const [showPosponerAnticipo, setShowPosponerAnticipo] = useState(false)
  const [showPosponerLiquidacion, setShowPosponerLiquidacion] = useState(false)

  if (!viaje) return null

  const handleAprobarAnticipo = () => {
    const viajeActualizado = {
      ...viaje,
      anticipo: {
        ...viaje.anticipo,
        aprobado: true,
        status: 'Aprobado' as const,
        notaRechazo: undefined
      }
    }
    if (onUpdate) {
      onUpdate(viajeActualizado)
    }
    onClose()
  }

  const handleRechazarAnticipo = () => {
    if (notaAnticipo.trim()) {
      const viajeActualizado = {
        ...viaje,
        anticipo: {
          ...viaje.anticipo,
          aprobado: false,
          status: 'Rechazado' as const,
          notaRechazo: notaAnticipo.trim()
        }
      }
      if (onUpdate) {
        onUpdate(viajeActualizado)
      }
      setShowNotaAnticipo(false)
      setNotaAnticipo('')
      onClose()
    }
  }

  const handleAprobarLiquidacion = () => {
    const viajeActualizado = {
      ...viaje,
      liquidacion: {
        ...viaje.liquidacion,
        aprobado: true,
        status: 'Aprobado' as const,
        notaRechazo: undefined
      }
    }
    if (onUpdate) {
      onUpdate(viajeActualizado)
    }
    onClose()
  }

  const handleRechazarLiquidacion = () => {
    if (notaLiquidacion.trim()) {
      const viajeActualizado = {
        ...viaje,
        liquidacion: {
          ...viaje.liquidacion,
          aprobado: false,
          status: 'Rechazado' as const,
          notaRechazo: notaLiquidacion.trim()
        }
      }
      if (onUpdate) {
        onUpdate(viajeActualizado)
      }
      setShowNotaLiquidacion(false)
      setNotaLiquidacion('')
      onClose()
    }
  }

  // Función para posponer anticipo (también pospone liquidación)
  const handlePosponerAnticipo = () => {
    if (notaAnticipoPospuesto.trim()) {
      const viajeActualizado = {
        ...viaje,
        anticipo: {
          ...viaje.anticipo,
          aprobado: false,
          status: 'Pospuesto' as const,
          notaPospuesto: notaAnticipoPospuesto.trim(),
          notaRechazo: undefined
        },
        liquidacion: {
          ...viaje.liquidacion,
          // Solo posponer liquidación si no está pagada
          ...(viaje.liquidacion.status !== 'Pagado' && {
            aprobado: false,
            status: 'Pospuesto' as const,
            notaPospuesto: 'Pospuesto automáticamente por posposición del anticipo',
            notaRechazo: undefined
          })
        }
      }
      if (onUpdate) {
        onUpdate(viajeActualizado)
      }
      setShowPosponerAnticipo(false)
      setNotaAnticipoPospuesto('')
      onClose()
    }
  }

  // Función para posponer liquidación (también pospone anticipo si no está pagado)
  const handlePosponerLiquidacion = () => {
    if (notaLiquidacionPospuesta.trim()) {
      const viajeActualizado = {
        ...viaje,
        liquidacion: {
          ...viaje.liquidacion,
          aprobado: false,
          status: 'Pospuesto' as const,
          notaPospuesto: notaLiquidacionPospuesta.trim(),
          notaRechazo: undefined
        },
        anticipo: {
          ...viaje.anticipo,
          // Solo posponer anticipo si no está pagado
          ...(viaje.anticipo.status !== 'Pagado' && {
            aprobado: false,
            status: 'Pospuesto' as const,
            notaPospuesto: 'Pospuesto automáticamente por posposición de la liquidación',
            notaRechazo: undefined
          })
        }
      }
      if (onUpdate) {
        onUpdate(viajeActualizado)
      }
      setShowPosponerLiquidacion(false)
      setNotaLiquidacionPospuesta('')
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Detalle de Comisión - {viaje.booking}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Información del Viaje</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Viajero:</span> {viaje.viajero}</p>
              <p><span className="font-medium">Especialista:</span> {viaje.especialista}</p>
              <p><span className="font-medium">Fecha de Venta:</span> {new Date(viaje.fechaVenta).toLocaleDateString()}</p>
              <p><span className="font-medium">Fecha de Viaje:</span> {new Date(viaje.fechaViaje).toLocaleDateString()}</p>
              <p><span className="font-medium">Días de Viaje:</span> {viaje.diasViaje}</p>
              <p><span className="font-medium">Comprador:</span> {viaje.comprador}</p>
              <p><span className="font-medium">NPS:</span> {viaje.nps}/10</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Comisiones</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Anticipo:</span> {fmtMXN(viaje.anticipo.monto)} ({viaje.anticipo.status})</p>
              <p><span className="font-medium">Porcentaje Anticipo:</span> {(viaje.anticipo.porcentaje * 100).toFixed(1)}%</p>
              <p><span className="font-medium">Liquidación:</span> {fmtMXN(viaje.liquidacion.monto)} ({viaje.liquidacion.status})</p>
              <p><span className="font-medium">Porcentaje Liquidación:</span> {(viaje.liquidacion.porcentaje * 100).toFixed(1)}%</p>
              <p><span className="font-medium">Total Comisión:</span> {fmtMXN(viaje.comisionTotal)}</p>
              {viaje.reviews5S.cantidad > 0 && (
                <p><span className="font-medium">Bono 5S:</span> {fmtMXN(viaje.reviews5S.comision)} ({viaje.reviews5S.cantidad} reviews)</p>
              )}
              <p><span className="font-medium">Por Pagar:</span> {fmtMXN(viaje.porPagar)}</p>
            </div>
          </div>
        </div>

        {/* Resumen Financiero - Nueva ubicación */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-900 mb-3">Resumen Financiero</h3>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"></th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Ingreso {viaje.ingresoMonedaOriginal.moneda}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Tipo de Cambio</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Ingreso (MXN)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">COGS</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Utilidad</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Margen %</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200">Cotizado</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {viaje.ingresoMonedaOriginal.moneda === 'USD' ? '$' : '€'}{Math.round(viaje.ingresoMonedaOriginal.monto).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{viaje.ingresoMonedaOriginal.tipoCambio.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">${Math.round(viaje.ingresoCotizado).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">${Math.round(viaje.cogsCotizados).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">${Math.round(viaje.utilidadCotizada).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                    {Math.round((viaje.utilidadCotizada / viaje.ingresoCotizado) * 100)}%
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200">Real</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {viaje.ingresoMonedaOriginal.moneda === 'USD' ? '$' : '€'}{Math.round(viaje.ingresoMonedaOriginal.monto).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{(viaje.ingresoReal / viaje.ingresoMonedaOriginal.monto).toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">${Math.round(viaje.ingresoReal).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">${Math.round(viaje.cogsReales).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">${Math.round(viaje.utilidadReal).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                    {viaje.ingresoReal > 0 ? Math.round((viaje.utilidadReal / viaje.ingresoReal) * 100) : 0}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Aprobación de Anticipo */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Aprobación de Anticipo</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Estado:</span>
            {viaje.anticipo.status === 'N/A' ? (
              <span className="text-gray-600 text-sm">No aplica</span>
            ) : viaje.anticipo.status === 'Pospuesto' ? (
              <span className="text-purple-600 text-sm">Pospuesto por Admin</span>
            ) : viaje.anticipo.status === 'Pagado' ? (
              <span className="text-blue-600 text-sm">Pagado</span>
            ) : viaje.anticipo.status === 'Aprobado' ? (
              <span className="text-green-600 text-sm">✓ Aprobado</span>
            ) : viaje.anticipo.status === 'Rechazado' ? (
              <span className="text-red-600 text-sm">✗ Rechazado</span>
            ) : (
              <span className="text-yellow-600 text-sm">Pendiente de revisión</span>
            )}
          </div>
          
          {viaje.anticipo.notaRechazo && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
              <p className="text-sm text-red-700"><strong>Nota de rechazo:</strong> {viaje.anticipo.notaRechazo}</p>
            </div>
          )}

          {viaje.anticipo.notaPospuesto && (
            <div className="mt-2 p-2 bg-purple-50 border border-purple-200 rounded">
              <p className="text-sm text-purple-700"><strong>Nota de posposición:</strong> {viaje.anticipo.notaPospuesto}</p>
            </div>
          )}

          {viaje.anticipo.status === 'Pendiente' && (
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleAprobarAnticipo}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Aprobar
              </button>
              <button
                onClick={() => setShowNotaAnticipo(true)}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Rechazar
              </button>
              {isAdmin && (
                <button
                  onClick={() => setShowPosponerAnticipo(true)}
                  className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                >
                  Posponer
                </button>
              )}
            </div>
          )}
        </div>

        {/* Aprobación de Liquidación */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Aprobación de Liquidación</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Estado:</span>
            {viaje.liquidacion.status === 'N/A' ? (
              <span className="text-gray-600 text-sm">No aplica</span>
            ) : viaje.liquidacion.status === 'Pospuesto' ? (
              <span className="text-purple-600 text-sm">Pospuesto por Admin</span>
            ) : viaje.liquidacion.status === 'Pagado' ? (
              <span className="text-blue-600 text-sm">Pagado</span>
            ) : viaje.liquidacion.status === 'Aprobado' ? (
              <span className="text-green-600 text-sm">✓ Aprobado</span>
            ) : viaje.liquidacion.status === 'Rechazado' ? (
              <span className="text-red-600 text-sm">✗ Rechazado</span>
            ) : (
              <span className="text-yellow-600 text-sm">Pendiente de revisión</span>
            )}
          </div>
          
          {viaje.liquidacion.notaRechazo && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
              <p className="text-sm text-red-700"><strong>Nota de rechazo:</strong> {viaje.liquidacion.notaRechazo}</p>
            </div>
          )}

          {viaje.liquidacion.notaPospuesto && (
            <div className="mt-2 p-2 bg-purple-50 border border-purple-200 rounded">
              <p className="text-sm text-purple-700"><strong>Nota de posposición:</strong> {viaje.liquidacion.notaPospuesto}</p>
            </div>
          )}

          {viaje.liquidacion.status === 'Pendiente' && (
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleAprobarLiquidacion}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Aprobar
              </button>
              <button
                onClick={() => setShowNotaLiquidacion(true)}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Rechazar
              </button>
              {isAdmin && (
                <button
                  onClick={() => setShowPosponerLiquidacion(true)}
                  className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                >
                  Posponer
                </button>
              )}
            </div>
          )}
        </div>

        {/* Modal para nota de comisión */}
        {showNotaAnticipo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Motivo del Rechazo</h3>
              <textarea
                value={notaAnticipo}
                onChange={(e) => setNotaAnticipo(e.target.value)}
                placeholder="Ingresa el motivo del rechazo..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows={4}
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleRechazarAnticipo}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Confirmar Rechazo
                </button>
                <button
                  onClick={() => setShowNotaAnticipo(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para nota de bono 5S */}
        {showNotaLiquidacion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Motivo del Rechazo de la Liquidación</h3>
              <textarea
                value={notaLiquidacion}
                onChange={(e) => setNotaLiquidacion(e.target.value)}
                placeholder="Ingresa el motivo del rechazo..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows={4}
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleRechazarLiquidacion}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Confirmar Rechazo
                </button>
                <button
                  onClick={() => setShowNotaLiquidacion(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para posponer anticipo */}
        {showPosponerAnticipo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Posponer Anticipo</h3>
              <p className="text-sm text-gray-600 mb-3">
                Al posponer el anticipo, la liquidación también se pospondrá automáticamente (a menos que ya esté pagada).
              </p>
              <textarea
                value={notaAnticipoPospuesto}
                onChange={(e) => setNotaAnticipoPospuesto(e.target.value)}
                placeholder="Ingresa el motivo de la posposición..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows={4}
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handlePosponerAnticipo}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Confirmar Posposición
                </button>
                <button
                  onClick={() => setShowPosponerAnticipo(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para posponer liquidación */}
        {showPosponerLiquidacion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Posponer Liquidación</h3>
              <p className="text-sm text-gray-600 mb-3">
                Al posponer la liquidación, el anticipo también se pospondrá automáticamente (a menos que ya esté pagado).
              </p>
              <textarea
                value={notaLiquidacionPospuesta}
                onChange={(e) => setNotaLiquidacionPospuesta(e.target.value)}
                placeholder="Ingresa el motivo de la posposición..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows={4}
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handlePosponerLiquidacion}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Confirmar Posposición
                </button>
                <button
                  onClick={() => setShowPosponerLiquidacion(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
