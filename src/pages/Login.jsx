// El usuario ingresa acá.
// El login usa contexto para compartir con otras páginas el estado login del usuario, su identificación y token.

// Bibliotecas.
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// Proveedor.
import { useAuth } from '../context/AuthContext'
// Service.
import { loginUser } from '../services/LoginService'

export default function Login() {
    // Variables que usa el formulario, recuerda que tambien tenemos errores en cada input.
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()  // Usa el contexto.
    const navigate = useNavigate()  // Navegador.

    const handleSubmit = async (e) => {  // Función asincrona que intenta la acción.
        e.preventDefault()
        setError('')
        setLoading(true)

    try {
        // Guardamos en variables el retorno de la función del service.
        const { user, token } = await loginUser({ email, password })
        login({ ...user, token })  // o solo user si no usas token por ahora

      navigate('/inicio')  // Si todo bien navigate nos manda a la página inicio.
    } catch (err) {
      setError(err.message || 'Error al conectar con el servidor')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <h1 className="text-primary mb-4 text-center">Iniciar Sesión</h1>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError('')}
                aria-label="Close"
              ></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Usuario o Email</label>
              <input
                type="text"
                className="form-control"
                id="email"
                placeholder="ej: leo@contadores.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mb-3"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Ingresando...
                </>
              ) : (
                'Ingresar'
              )}
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


