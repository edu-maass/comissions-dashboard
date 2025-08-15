import React from 'react'

interface ExportButtonProps {
  rows: any[]
  filename?: string
}

export default function ExportButton({ rows, filename = 'export' }: ExportButtonProps) {
  const exportToExcel = () => {
    if (rows.length === 0) {
      alert('No hay datos para exportar')
      return
    }

    // Crear el contenido HTML para Excel
    const headers = Object.keys(rows[0])
    const headerRow = headers.map(header => `<th>${header}</th>`).join('')
    
    const dataRows = rows.map(row => 
      headers.map(header => `<td>${row[header] || ''}</td>`).join('')
    ).map(rowData => `<tr>${rowData}</tr>`).join('')
    
    const htmlContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>${filename}</title>
        </head>
        <body>
          <table border="1">
            <thead>
              <tr>${headerRow}</tr>
            </thead>
            <tbody>
              ${dataRows}
            </tbody>
          </table>
        </body>
      </html>
    `

    // Crear y descargar el archivo
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.xls`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={exportToExcel}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
      title="Exportar a Excel"
    >
      📊 Exportar a Excel
    </button>
  )
}
