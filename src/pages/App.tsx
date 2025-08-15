import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useSession } from '../state/useSession'
import Dashboard from './Dashboard'
import Historic from './Historic'
import Profile from './Profile'
import Login from './Login'
import Bonos from './Bonos'

export default function App() {
  const { user, logout } = useSession()
  const location = useLocation()

  console.log('🔍 App renderizando, user:', user)
  console.log('🔍 Location:', location.pathname)

  // Componente de prueba simple
  if (!user) {
    console.log('🔍 No hay usuario, mostrando Login')
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-blue-600 mb-4">🔍 Debug: Login Component</h1>
          <p className="text-gray-600">Usuario no autenticado</p>
          <button 
            onClick={() => console.log('🔍 Botón de prueba clickeado')}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Botón de Prueba
          </button>
        </div>
      </div>
    )
  }

  console.log('🔍 Usuario autenticado, mostrando dashboard')
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Dashboard de Comisiones</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Bienvenido, {user.nombre}</span>
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link
              to="/"
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                location.pathname === '/' || location.pathname === '/dashboard'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/historic"
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                location.pathname === '/historic'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Histórico
            </Link>
            <Link
              to="/bonos"
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                location.pathname === '/bonos'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Bonos
            </Link>
            <Link
              to="/profile"
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                location.pathname === '/profile'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Perfil
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/historic" element={<Historic />} />
          <Route path="/bonos" element={<Bonos />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  )
}
