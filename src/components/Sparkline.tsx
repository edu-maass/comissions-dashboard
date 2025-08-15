import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts'

export default function Sparkline({ data }:{ data:{ dia:number; monto:number }[] }) {
  return (
    <div className="h-10 w-32">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Tooltip formatter={(v)=>[v as number, 'MXN']} labelFormatter={(l)=>`Día ${l}`} />
          <Line type="monotone" dataKey="monto" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
