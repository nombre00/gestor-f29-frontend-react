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
        e.preventDefault()  // Evita que se ingresen los valores default.
        setError('')  // Inicializamos el texto del error.
        setLoading(true)  // Cambiamos el estado del hook del spinner.
    try {  // Intentamos:
      // Guardamos en variables el retorno de la función del service.
      const { user, token } = await loginUser({ email, password })  // Guardamos el usuario.
      localStorage.setItem('token', token)  // Guardamos el token
      login(user, token)  //  Verificamos el token dado usando el contexto de verificación.
      navigate('/inicio')  // Si todo bien navigate nos manda a la página inicio.
    } catch (err) {  // Si error:
      setError(err.message || 'Error al conectar con el servidor')
      console.error('Login error:', err)
    } finally {  // Finalmente cambiamos el estado del hook del spinner.
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
        </div>
      </div>
    </div>
  )
}


