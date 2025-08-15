import { useSession } from '../state/useSession'

export default function Profile() {
  const { user } = useSession()
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="card">
        <h2 className="text-lg font-semibold mb-2">Perfil</h2>
        <div className="text-sm">
          <div><b>Nombre:</b> {user?.nombre}</div>
          <div><b>Email:</b> {user?.email}</div>
          <div><b>Rol:</b> {user?.rol}</div>
        </div>
      </div>
      <div className="card">
        <h2 className="text-lg font-semibold mb-2">Sesión</h2>
        <p className="text-sm text-neutral-500">Tu sesión se mantiene localmente. Este demo no envía correos reales.</p>
      </div>
    </div>
  )
}
