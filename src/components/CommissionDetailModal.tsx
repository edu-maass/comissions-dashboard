import { useState } from 'react'
import type { Viaje } from '../lib/types'
import { fmtMXN } from '../lib/format'

interface Props {
  viaje: Viaje | null
  onClose: () => void
  onUpdate: (viaje: Viaje) => void
}

export default function CommissionDetailModal({ viaje, onClose, onUpdate }: Props) {
  const [notaComision, setNotaComision] = useState(viaje?.notaComision || '')
  const [notaBono5S, setNotaBono5S] = useState(viaje?.notaBono5S || '')
  const [showNotaComision, setShowNotaComision] = useState(false)
  const [showNotaBono5S, setShowNotaBono5S] = useState(false)

  if (!viaje) return null

  const handleAprobarComision = () => {
    const viajeActualizado = {
      ...viaje,
      comisionAprobada: true,
      notaComision: undefined
    }
    onUpdate(viajeActualizado)
  }

  const handleRechazarComision = () => {
    if (notaComision.trim()) {
      const viajeActualizado = {
        ...viaje,
        comisionAprobada: false,
        notaComision: notaComision.trim()
      }
      onUpdate(viajeActualizado)
      setShowNotaComision(false)
      setNotaComision('')
    }
  }

  const handleAprobarBono5S = () => {
    const viajeActualizado = {
      ...viaje,
      bono5SAprobado: true,
      notaBono5S: undefined
    }
    onUpdate(viajeActualizado)
  }

  const handleRechazarBono5S = () => {
    if (notaBono5S.trim()) {
      const viajeActualizado = {
        ...viaje,
        bono5SAprobado: false,
        notaBono5S: notaBono5S.trim()
      }
      onUpdate(viajeActualizado)
      setShowNotaBono5S(false)
      setNotaBono5S('')
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
              <p><span className="font-medium">Utilidad Cotizada:</span> {fmtMXN(viaje.utilidadCotizada)}</p>
              <p><span className="font-medium">Utilidad Real:</span> {fmtMXN(viaje.utilidadReal)}</p>
              <p><span className="font-medium">NPS:</span> {viaje.nps}/10</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Comisiones</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Anticipo:</span> {fmtMXN(viaje.anticipo.monto)} ({viaje.anticipo.status})</p>
              <p><span className="font-medium">Liquidación:</span> {fmtMXN(viaje.liquidacion.monto)} ({viaje.liquidacion.status})</p>
              <p><span className="font-medium">Total Comisión:</span> {fmtMXN(viaje.comisionTotal)}</p>
              {viaje.reviews5S.cantidad > 0 && (
                <p><span className="font-medium">Bono 5S:</span> {fmtMXN(viaje.reviews5S.comision)} ({viaje.reviews5S.cantidad} reviews)</p>
              )}
              <p><span className="font-medium">Por Pagar:</span> {fmtMXN(viaje.porPagar)}</p>
            </div>
          </div>
        </div>

        {/* Aprobación de Comisión */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Aprobación de Comisión</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Estado:</span>
            {viaje.comisionAprobada === undefined ? (
              <span className="text-yellow-600 text-sm">Pendiente de revisión</span>
            ) : viaje.comisionAprobada ? (
              <span className="text-green-600 text-sm">✓ Aprobada</span>
            ) : (
              <span className="text-red-600 text-sm">✗ Rechazada</span>
            )}
          </div>
          
          {viaje.notaComision && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
              <p className="text-sm text-red-700"><strong>Nota:</strong> {viaje.notaComision}</p>
            </div>
          )}

          {viaje.comisionAprobada === undefined && (
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleAprobarComision}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Aprobar
              </button>
              <button
                onClick={() => setShowNotaComision(true)}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Rechazar
              </button>
            </div>
          )}
        </div>

        {/* Aprobación de Bono 5S */}
        {viaje.reviews5S.cantidad > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Aprobación de Bono 5S</h3>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Estado:</span>
              {viaje.bono5SAprobado === undefined ? (
                <span className="text-yellow-600 text-sm">Pendiente de revisión</span>
              ) : viaje.bono5SAprobado ? (
                <span className="text-green-600 text-sm">✓ Aprobado</span>
              ) : (
                <span className="text-red-600 text-sm">✗ Rechazado</span>
              )}
            </div>
            
            {viaje.notaBono5S && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-700"><strong>Nota:</strong> {viaje.notaBono5S}</p>
              </div>
            )}

            {viaje.bono5SAprobado === undefined && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={handleAprobarBono5S}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => setShowNotaBono5S(true)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Rechazar
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modal para nota de comisión */}
        {showNotaComision && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Motivo del Rechazo</h3>
              <textarea
                value={notaComision}
                onChange={(e) => setNotaComision(e.target.value)}
                placeholder="Ingresa el motivo del rechazo..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows={4}
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleRechazarComision}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Confirmar Rechazo
                </button>
                <button
                  onClick={() => setShowNotaComision(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para nota de bono 5S */}
        {showNotaBono5S && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Motivo del Rechazo del Bono 5S</h3>
              <textarea
                value={notaBono5S}
                onChange={(e) => setNotaBono5S(e.target.value)}
                placeholder="Ingresa el motivo del rechazo..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows={4}
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleRechazarBono5S}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Confirmar Rechazo
                </button>
                                 <button
                   onClick={() => setShowNotaBono5S(false)}
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
