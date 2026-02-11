// El usuario ingresa acá.

// src/pages/Login.jsx

import { Link } from 'react-router-dom'   // ← importa esto si no lo tienes

export default function Login() {
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <h1 className="text-primary mb-4 text-center">Iniciar Sesión</h1>
          
          {/* Formulario de login (placeholder por ahora) */}
          <form>
            <div className="mb-3">
              <label htmlFor="usuario" className="form-label">Usuario o Email</label>
              <input type="text" className="form-control" id="usuario" placeholder="ej: leo@contadores.cl" />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input type="password" className="form-control" id="password" />
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3">
              Ingresar
            </button>
          </form>

          {/* Botón para saltar directo a inicio (ideal para desarrollo) */}
          <div className="text-center mt-4">
            <Link to="/inicio" className="btn btn-outline-secondary btn-lg w-100">
              <i className="bi bi-arrow-right-circle me-2"></i>
              Entrar directamente al Dashboard (solo pruebas)
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}