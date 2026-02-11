// src/layouts/DashboardLayout.jsx

import { Outlet } from 'react-router-dom'
import Sidebar from '../components/SideBar'

export default function DashboardLayout() {
  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar fijo a la izquierda */}
      <Sidebar />

      {/* Contenido principal: margen izquierdo para no superponerse al sidebar */}
      <div 
        className="flex-grow-1 d-flex flex-column"
        style={{ marginLeft: '250px' }}  // mismo ancho que el sidebar
      >
        {/* Área donde se renderizan las páginas */}
        <main className="flex-grow-1 p-4 p-md-5">
          <Outlet />
        </main>

        {/* Footer simple al final */}
        <footer className="bg-light text-center py-3 mt-auto">
          <small className="text-muted">
            Gestor F29 • {new Date().getFullYear()}
          </small>
        </footer>
      </div>
    </div>
  )
}