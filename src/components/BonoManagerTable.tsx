import * as React from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table'
import type { Viaje } from '../lib/types'
import { fmtMXN, toDMY } from '../lib/format'

const columnHelper = createColumnHelper<Viaje>()

export default function BonoManagerTable({ data, onRowOpen }:{ data:Viaje[]; onRowOpen:(row:Viaje)=>void }) {
  const [sorting, setSorting] = React.useState<SortingState>([{ id:'fechaViaje', desc:true }])

  const columns = React.useMemo(()=>[
    columnHelper.accessor('booking', {
      header: 'BKFI',
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
    columnHelper.accessor('utilidadReal', { 
      header: 'Utilidad Real', 
      cell: info => info.getValue() ? fmtMXN(info.getValue()!) : <span title="No disponible">N/A</span>,
      enableSorting: true
    }),
    columnHelper.accessor('bonoManager.porcentaje', { 
      header: 'Comisión %', 
      cell: info => `${(info.getValue()*100).toFixed(1)}%`,
      enableSorting: true
    }),
    columnHelper.accessor('bonoManager.comision', { 
      header: 'Comisión Total', 
      cell: info => info.getValue() ? fmtMXN(info.getValue()!) : <span title="No disponible">N/A</span>,
      enableSorting: true
    }),
    columnHelper.accessor('bonoManager.status', { 
      header: 'Status Bono Manager', 
      cell: info => {
        const status = info.getValue()
        let cl = ''
        
        switch(status) {
          case 'N/A':
            cl = 'bg-gray-100 text-gray-800 border-gray-200'
            break
          case 'Pendiente':
            cl = 'bg-yellow-100 text-yellow-800 border-yellow-200'
            break
          case 'Aprobado':
            cl = 'bg-green-100 text-green-800 border-green-200'
            break
          case 'Rechazado':
            cl = 'bg-red-100 text-red-800 border-red-200'
            break
          case 'Pospuesto':
            cl = 'bg-purple-100 text-purple-800 border-purple-200'
            break
          case 'Pagado':
            cl = 'bg-blue-100 text-blue-800 border-blue-200'
            break
          default:
            cl = 'bg-gray-100 text-gray-800 border-gray-200'
        }
        
        return <span className={`px-2 py-1 rounded-full text-xs font-medium border ${cl}`}>{status}</span>
      },
      enableSorting: true
    }),
    columnHelper.accessor('bonoManager.comision', { 
      header: 'Por Pagar', 
      cell: info => {
        const viaje = info.row.original
        const monto = viaje.bonoManager.status === 'Aprobado' ? viaje.bonoManager.comision : 0
        return <span className="font-semibold">{fmtMXN(monto)}</span>
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
          <thead className="sticky top-0 bg-white border-b border-gray-200 z-20">
            {table.getHeaderGroups().map(hg=> (
              <tr key={hg.id}>
                {hg.headers.map((h, index)=> (
                  <th 
                    key={h.id} 
                    className={`text-left text-xs font-medium px-3 py-3 whitespace-nowrap cursor-pointer select-none bg-white border-r border-gray-200 last:border-r-0 ${
                      index === 0 ? 'sticky-left-header' : ''
                    }`}
                    onClick={h.column.getToggleSortingHandler()}
                    style={{ 
                      minWidth: '120px',
                      ...(index === 0 && { 
                        position: 'sticky',
                        left: 0,
                        zIndex: 30,
                        backgroundColor: 'white'
                      })
                    }}
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
                    style={{ 
                      minWidth: '120px',
                      ...(index === 0 && { 
                        position: 'sticky',
                        left: 0,
                        zIndex: 20,
                        backgroundColor: 'white'
                      })
                    }}
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
