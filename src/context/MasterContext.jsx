// Proveedor de proveedores.
// Acá se agregan los distintos proveedores de contexto del programa.

import { AuthProvider } from '../context/AuthContext'


export default function AppProviders({ children }) {
  return (
    <AuthProvider>
            {children}
    </AuthProvider>
  )
}