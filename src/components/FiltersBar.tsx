import { useState } from 'react'
import type { Filters } from '../lib/types'

export default function FiltersBar({ value, onChange, isAdmin }:{ value:Filters; onChange:(f:Filters)=>void; isAdmin:boolean }) {
  const [local, setLocal] = useState<Filters>(value)
  const apply = () => onChange(local)
  const clearChip = (k:keyof Filters) => { const n = { ...local }; (n as any)[k] = ''; setLocal(n); onChange(n) }

  return (
    <div className="card">
      <div className="grid md:grid-cols-4 gap-2">
        <input className="input md:col-span-2" placeholder="Buscar Booking / Viajero / Especialista" value={local.q||''} onChange={e=>setLocal({...local, q:e.target.value})} />
        <select 
          className="input" 
          value={local.rol||''} 
          onChange={e=>setLocal({...local, rol:e.target.value as any || undefined})}
        >
          <option value="">Todos los roles</option>
          <option value="Especialista">Especialista</option>
          <option value="Apoyo">Apoyo</option>
          <option value="Reservas">Reservas</option>
          <option value="Seguimiento">Seguimiento</option>
          <option value="Tripbook">Tripbook</option>
        </select>
        <select 
          className="input" 
          value={local.statusLiquidacion||''} 
          onChange={e=>setLocal({...local, statusLiquidacion:e.target.value as any || undefined})}
        >
          <option value="">Todos los status</option>
          <option value="Pagada">Pagada</option>
          <option value="Pendiente">Pendiente</option>
        </select>
        <select 
          className="input" 
          value={local.tipoViaje||'todos'} 
          onChange={e=>setLocal({...local, tipoViaje:e.target.value as any})}
        >
          <option value="">Todos los viajes</option>
          <option value="anticipo">Solo anticipos</option>
          <option value="liquidacion">Solo liquidaciones</option>
        </select>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <button className="btn-ghost" onClick={apply}>Aplicar filtros</button>
        <div className="flex flex-wrap gap-1">
          {Object.entries(value).filter(([_,v])=>v && v !== 'todos').map(([k,v])=> (
            <span key={k} className="badge">
              {`${k}: ${v}`}
              <button className="ml-1 text-neutral-500" onClick={()=>clearChip(k as any)} aria-label={`Quitar filtro ${k}`}>✕</button>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
