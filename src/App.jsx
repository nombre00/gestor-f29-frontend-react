// App.jsx
// Punto central de enrutamiento de la aplicación

import { Routes, Route, Navigate } from 'react-router-dom'
// Layouts.
import DashboardLayout from './layouts/DashboardLayout'
// páginas.
import Login from './pages/Login'
import RegistrarEmpresa from './pages/RegistrarEmpresa'
import VistaInicio from './pages/Inicio'
import GestorF29 from './pages/GestorF29'
import VistaResumenF29 from './pages/VistaResumenF29'
import VistaResumenAnual from './pages/GestorResumenAnual'

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Routes>

        {/* Rutas públicas - sin layout ni sidebar */}
        <Route path="/login" element={<Login />} />
        
        {/* Rutas protegidas - con DashboardLayout (sidebar + margen) */}
        <Route element={<DashboardLayout />}>
          <Route path="/inicio" element={<VistaInicio />} />
          <Route path="/gestor" element={<GestorF29 />} />
          <Route path="/resumen" element={<VistaResumenF29 />} />
          <Route path="/resumen-anual" element={<VistaResumenAnual />} />
          <Route path="/registrar-empresa" element={<RegistrarEmpresa />} />
        </Route>

        {/* Redirecciones y 404 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={
          <div className="container my-5 text-center">
            <h2>404 - Página no encontrada</h2>
            <p>
              Vuelve al <a href="/login">inicio de sesión</a>
            </p>
          </div>
        } />

      </Routes>
    </div>
  )
}

export default App