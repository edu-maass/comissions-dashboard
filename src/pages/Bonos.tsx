import React from 'react'

export default function Bonos() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Esquemas de Bonos y Comisiones</h1>
        <p className="text-sm text-gray-600 mt-2">
          Información detallada sobre los esquemas de bonos vigentes y sus características
        </p>
      </div>

      {/* Esquema Anterior */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <div className="w-4 h-4 bg-purple-500 rounded-full mr-3"></div>
          <h2 className="text-xl font-semibold text-gray-900">Esquema Anterior (Hasta Agosto 2025)</h2>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Anticipos</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Se pagan al cierre de venta</li>
              <li>• Porcentaje: 2% - 3.5% de utilidad cotizada</li>
              <li>• Monto variable según el viaje</li>
              <li>• Status: Pagado o Pendiente</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Liquidaciones</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Se pagan después del viaje</li>
              <li>• Porcentaje: 4% de utilidad real</li>
              <li>• Solo para viajes operados</li>
              <li>• Status: Pagado o Pendiente</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="font-medium text-purple-900 mb-2">Características del Esquema Anterior:</h4>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• Anticipos más altos (2-3.5%)</li>
            <li>• Liquidaciones al 4% de utilidad real</li>
            <li>• Comisiones 5S: 1% por review</li>
            <li>• Aplicable a viajes vendidos hasta agosto 2025</li>
          </ul>
        </div>
      </div>

      {/* Esquema Nuevo */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
          <h2 className="text-xl font-semibold text-gray-900">Esquema Nuevo (Desde Septiembre 2025)</h2>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Anticipos</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Se pagan al cierre de venta</li>
              <li>• Porcentaje: 2.5% - 3% de utilidad cotizada</li>
              <li>• Monto más equilibrado</li>
              <li>• Status: Pagado o Pendiente</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Liquidaciones</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Se pagan después del viaje</li>
              <li>• Porcentaje: 5% de utilidad real</li>
              <li>• Solo para viajes operados</li>
              <li>• Status: Pagado o Pendiente</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Características del Esquema Nuevo:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Anticipos más equilibrados (2.5-3%)</li>
            <li>• Liquidaciones al 5% de utilidad real</li>
            <li>• Comisiones 5S: 1.5% por review</li>
            <li>• Aplicable a viajes vendidos desde septiembre 2025</li>
          </ul>
        </div>
      </div>

      {/* Comisiones 5S */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Comisiones 5S Reviews</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Esquema Anterior</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• 1 Review: 1% de utilidad cotizada</li>
              <li>• 2 Reviews: 2% de utilidad cotizada</li>
              <li>• 3+ Reviews: 3% de utilidad cotizada</li>
              <li>• Se pagan al completar el viaje</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Esquema Nuevo</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• 1 Review: 1.5% de utilidad cotizada</li>
              <li>• 2 Reviews: 3% de utilidad cotizada</li>
              <li>• 3+ Reviews: 4.5% de utilidad cotizada</li>
              <li>• Se pagan al completar el viaje</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Resumen de Vigencia */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen de Vigencia</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Período</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Anticipos</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Liquidaciones</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">5S Reviews</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-sm text-gray-600">Hasta Agosto 2025</td>
                <td className="py-3 px-4 text-sm text-gray-600">2% - 3.5%</td>
                <td className="py-3 px-4 text-sm text-gray-600">4%</td>
                <td className="py-3 px-4 text-sm text-gray-600">1% por review</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full border border-purple-200">
                    Anterior
                  </span>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-sm text-gray-600">Desde Septiembre 2025</td>
                <td className="py-3 px-4 text-sm text-gray-600">2.5% - 3%</td>
                <td className="py-3 px-4 text-sm text-gray-600">5%</td>
                <td className="py-3 px-4 text-sm text-gray-600">1.5% por review</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full border border-blue-200">
                    Nuevo
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="font-medium text-yellow-900 mb-2">⚠️ Nota Importante:</h4>
          <p className="text-sm text-yellow-700">
            El esquema aplicable se determina por la <strong>fecha de venta</strong> del viaje, no por la fecha de operación. 
            Los viajes vendidos antes del 1 de septiembre de 2025 mantienen el esquema anterior, mientras que los vendidos 
            a partir de esa fecha aplican el nuevo esquema.
          </p>
        </div>
      </div>
    </div>
  )
}
