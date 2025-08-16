import * as React from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table'
import type { Viaje } from '../lib/types'
import { fmtMXN, toDMY } from '../lib/format'

const columnHelper = createColumnHelper<Viaje>()

export default function CommissionsTable({ data, onRowOpen }:{ data:Viaje[]; onRowOpen:(row:Viaje)=>void }) {
  const [sorting, setSorting] = React.useState<SortingState>([{ id:'fechaVenta', desc:true }])

  const columns = React.useMemo(()=>[
    columnHelper.accessor('booking', {
      header: 'Booking',
      cell: info => <button className="underline" onClick={()=>onRowOpen(info.row.original)}>{info.getValue()}</button>,
      enableSorting: true
    }),
    columnHelper.accessor('fechaVenta', { 
      header: 'Fecha Venta', 
      cell: info => toDMY(info.getValue()),
      enableSorting: true
    }),
    columnHelper.accessor('fechaViaje', { 
      header: 'Fecha Operación', 
      cell: info => toDMY(info.getValue()),
      enableSorting: true
    }),
    columnHelper.accessor('viajero', { 
      header: 'Viajero',
      enableSorting: true
    }),
    columnHelper.accessor('utilidadCotizada', { 
      header: 'Utilidad Cotizada', 
      cell: info => fmtMXN(info.getValue()),
      enableSorting: true
    }),
    columnHelper.accessor('utilidadReal', { 
      header: 'Utilidad Real', 
      cell: info => info.getValue() ? fmtMXN(info.getValue()!) : <span title="No disponible">N/A</span>,
      enableSorting: true
    }),
    columnHelper.accessor('nps', { 
      header: 'NPS', 
      cell: info => info.getValue(),
      enableSorting: true
    }),
    columnHelper.accessor('anticipo.porcentaje', { 
      header: 'Anticipo %', 
      cell: info => `${(info.getValue()*100).toFixed(1)}%`,
      enableSorting: true
    }),
    columnHelper.accessor('anticipo.monto', { 
      header: 'Anticipo $', 
      cell: info => fmtMXN(info.getValue()),
      enableSorting: true
    }),
    columnHelper.accessor('anticipo.status', { 
      header: 'Status Anticipo', 
      cell: info => {
        const v = info.getValue()
        const cl = v==='Pagado' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'
        return <span className={`px-2 py-1 rounded-full text-xs font-medium border ${cl}`}>{v}</span>
      },
      enableSorting: true
    }),
    columnHelper.accessor('liquidacion.porcentaje', { 
      header: 'Comisión %', 
      cell: info => `${(info.getValue()*100).toFixed(1)}%`,
      enableSorting: true
    }),
    columnHelper.accessor('comisionTotal', { 
      header: 'Comisión Total', 
      cell: info => info.getValue() ? fmtMXN(info.getValue()!) : <span title="Al cierre">N/A</span>,
      enableSorting: true
    }),
    columnHelper.accessor('liquidacion.monto', { 
      header: 'Liquidación Total', 
      cell: info => info.getValue() ? fmtMXN(info.getValue()!) : <span title="Al cierre">N/A</span>,
      enableSorting: true
    }),
    columnHelper.accessor('liquidacion.status', { 
      header: 'Status Liquidación', 
      cell: info => {
        const status = info.getValue()
        if (!status) return <span className="text-gray-400">N/A</span>
        
        const cl = status === 'Pagada' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'
        const texto = status === 'Pagada' ? 'Pagada' : 'Pendiente'
        
        return <span className={`px-2 py-1 rounded-full text-xs font-medium border ${cl}`}>{texto}</span>
      },
      enableSorting: true
    }),
    columnHelper.accessor('porPagar', { 
      header: 'Por Pagar', 
      cell: info => <span className="font-semibold">{fmtMXN(info.getValue())}</span>,
      enableSorting: true
    }),
    columnHelper.accessor('fechaVenta', { 
      header: 'Bono', 
      cell: info => {
        const fechaVenta = new Date(info.getValue())
        const fechaLimite = new Date('2025-09-01')
        const esEsquemaNuevo = fechaVenta >= fechaLimite
        
        const cl = esEsquemaNuevo ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-purple-100 text-purple-800 border-purple-200'
        const texto = esEsquemaNuevo ? 'Nuevo' : 'Anterior'
        
        return <span className={`px-2 py-1 rounded-full text-xs font-medium border ${cl}`}>{texto}</span>
      },
      enableSorting: true
    }),
    // Columna de aprobación de comisión
    columnHelper.accessor('comisionAprobada', {
      header: 'Aprobar Comisión',
      cell: info => {
        const viaje = info.row.original
        if (viaje.comisionAprobada === undefined) {
          return <span className="text-yellow-600 text-sm">Pendiente</span>
        } else if (viaje.comisionAprobada) {
          return <span className="text-green-600 text-sm">✓ Aprobada</span>
        } else {
          return <span className="text-red-600 text-sm">✗ Rechazada</span>
        }
      },
      enableSorting: true
    }),
  ], [])

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting
  })

  const parentRef = React.useRef<HTMLDivElement>(null)
  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 8,
  })
  const items = rowVirtualizer.getVirtualItems()
  const totalSize = rowVirtualizer.getTotalSize()

  return (
    <div className="card">
      <div ref={parentRef} className="max-h-[520px] overflow-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-white border-b border-gray-200 z-10">
            {table.getHeaderGroups().map(hg=> (
              <tr key={hg.id}>
                {hg.headers.map((h, index)=> (
                  <th 
                    key={h.id} 
                    className={`text-left text-xs font-medium px-3 py-3 whitespace-nowrap cursor-pointer select-none bg-white border-r border-gray-200 last:border-r-0 ${
                      index === 0 ? 'sticky-left-header' : ''
                    }`}
                    onClick={h.column.getToggleSortingHandler()}
                    style={{ minWidth: '120px' }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{flexRender(h.column.columnDef.header, h.getContext())}</span>
                      <span className="ml-1 text-gray-400">
                        {{asc:' ▲', desc:' ▼'}[h.column.getIsSorted() as string] ?? null}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                onClick={() => onRowOpen(row.original)}
              >
                {row.getVisibleCells().map((cell, index) => (
                  <td 
                    key={cell.id} 
                    className={`px-3 py-3 text-sm border-r border-gray-100 last:border-r-0 ${
                      index === 0 ? 'sticky-left bg-white' : ''
                    }`}
                    style={{ minWidth: '120px' }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
