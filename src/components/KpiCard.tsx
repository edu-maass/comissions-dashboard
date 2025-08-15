import { ReactNode } from 'react'

export default function KpiCard({ title, value, subtitle, icon }: { title:string; value:string; subtitle?:string; icon?:ReactNode }) {
  return (
    <div className="kpi">
      <div className="text-xs text-neutral-500">{title}</div>
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      {subtitle && <div className="text-xs text-neutral-600 font-medium">{subtitle}</div>}
      {icon && <div>{icon}</div>}
    </div>
  )
}
