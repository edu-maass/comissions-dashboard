import { useState, useEffect } from 'react'
import type { Usuario } from '../lib/types'

// Usuario por defecto - Lisa Brissac
const defaultUser: Usuario = {
  id: 'u_lisa',
  nombre: 'Lisa Brissac',
  rol: 'vendedor',
  email: 'lisa@empresa.com'
}

export function useSession() {
  const [user, setUser] = useState<Usuario | null>(defaultUser)
  const [loading, setLoading] = useState(false)

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Simular login exitoso para Lisa Brissac
      await new Promise(resolve => setTimeout(resolve, 1000))
      setUser(defaultUser)
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Error en login' }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
  }

  return {
    user,
    loading,
    login,
    logout
  }
}
