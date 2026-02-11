// Contexto para el login.


import { createContext, useState, useContext } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (userData) => {
    setUser(userData)
    // Guardar en localStorage para persistencia simple
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const isAuthenticated = !!user

  // Cargar usuario desde localStorage al montar (simulado)
  const storedUser = localStorage.getItem('user')
  if (storedUser && !user) {
    try {
      setUser(JSON.parse(storedUser))
    } catch (e) {
      console.error('Error al cargar usuario guardado:', e)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}