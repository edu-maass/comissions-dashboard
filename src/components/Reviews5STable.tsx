import React from 'react'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, getSortedRowModel, SortingState } from '@tanstack/react-table'
import type { Viaje } from '../lib/types'
import { fmtMXN, toDMY } from '../lib/format'

const columnHelper = createColumnHelper<Viaje>()

interface Reviews5STableProps {
  data: Viaje[]
  onRowOpen: (viaje: Viaje) => void
}

export default function Reviews5STable({ data, onRowOpen }: Reviews5STableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const columns = React.useMemo(() => [
    columnHelper.accessor('booking', {
      header: 'Booking',
      cell: info => <button className="underline" onClick={() => onRowOpen(info.row.original)}>{info.getValue()}</button>,
      enableSorting: true
    }),
    columnHelper.accessor('viajero', { 
      header: 'Viajero',
      enableSorting: true
    }),
    columnHelper.accessor('fechaViaje', { 
      header: 'Fecha de Viaje', 
      cell: info => toDMY(info.getValue()),
      enableSorting: true
    }),
    columnHelper.accessor('nps', { 
      header: 'NPS', 
      cell: info => info.getValue(),
      enableSorting: true
    }),
    columnHelper.accessor('reviews5S.cantidad', { 
      header: '5S Reviews', 
      cell: info => {
        const cantidad = info.getValue()
        const cl = cantidad === 1 ? 'bg-blue-100 text-blue-800' : 
                   cantidad === 2 ? 'bg-green-100 text-green-800' : 
                   cantidad === 3 ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${cl}`}>
            {cantidad} Review{cantidad !== 1 ? 's' : ''}
          </span>
        )
      },
      enableSorting: true
    }),
    columnHelper.accessor('reviews5S.fecha1', { 
      header: 'Fecha Reseña 1', 
      cell: info => info.getValue() ? toDMY(info.getValue()!) : '-',
      enableSorting: true
    }),
    columnHelper.accessor('reviews5S.fecha2', { 
      header: 'Fecha Reseña 2', 
      cell: info => info.getValue() ? toDMY(info.getValue()!) : '-',
      enableSorting: true
    }),
    columnHelper.accessor('reviews5S.fecha3', { 
      header: 'Fecha Reseña 3', 
      cell: info => info.getValue() ? toDMY(info.getValue()!) : '-',
      enableSorting: true
    }),
    columnHelper.accessor('reviews5S.comision', { 
      header: 'Comisión Total', 
      cell: info => fmtMXN(info.getValue()),
      enableSorting: true
    }),
    columnHelper.accessor('reviews5S.pagado', { 
      header: 'Comisión Pagada', 
      cell: info => fmtMXN(info.getValue()),
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
  ], [onRowOpen])

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (data.length === 0) {
    return (
      <div className="bg-gray-50 p-8 text-center rounded-lg border border-gray-200">
        <div className="text-lg text-gray-600">No se encontraron viajes con 5S Reviews</div>
        <div className="text-sm text-gray-500 mt-2">
          Los viajes con 5S Reviews aparecerán aquí cuando estén disponibles.
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <div className="max-h-96 overflow-y-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-white border-b border-gray-200 z-10">
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map((h, index) => (
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
