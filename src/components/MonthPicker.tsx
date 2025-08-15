import { useState, useEffect } from 'react'

export default function MonthPicker({ value, onChange }:{ value: { mes:number; anio:number }; onChange:(v:{mes:number;anio:number})=>void }) {
  const [m, setM] = useState(value.mes)
  const [y, setY] = useState(value.anio)
  
  useEffect(()=>{ 
    onChange({ mes:m, anio:y }) 
  }, [m,y, onChange])
  
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
  
  return (
    <div className="flex items-center gap-2">
      <select 
        className="input" 
        value={m} 
        onChange={e=>setM(parseInt(e.target.value))} 
        aria-label="Mes"
      >
        {meses.map((mes, i) => (
          <option key={i+1} value={i+1}>
            {mes}
          </option>
        ))}
      </select>
      <input 
        className="input w-24" 
        type="number" 
        aria-label="Año" 
        value={y} 
        onChange={e=>setY(parseInt(e.target.value))}
        min="2020"
        max="2030"
      />
    </div>
  )
}
