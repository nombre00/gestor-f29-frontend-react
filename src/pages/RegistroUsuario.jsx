// Página pública accesible via /registro?token=XYZ
// El usuario invitado completa su registro: confirma nombre, elige contraseña.

import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { validarTokenInvitacion, completarRegistro } from '../services/invitacionesService';

export default function VistaRegistro() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  // Estado del proceso de validación del token
  const [tokenValido, setTokenValido] = useState(null); // null=cargando, true/false
  const [datosInvitacion, setDatosInvitacion] = useState(null);
  const [errorToken, setErrorToken] = useState('');

  // Estado del formulario
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [errorForm, setErrorForm] = useState('');
  const [loading, setLoading] = useState(false);
  const [registroExitoso, setRegistroExitoso] = useState(false);

  // Al montar, validar el token
  useEffect(() => {
    if (!token) {
      setTokenValido(false);
      setErrorToken('No se encontró un token de invitación en el enlace.');
      return;
    }
    validarToken();
  }, [token]);

  const validarToken = async () => {
    try {
      const datos = await validarTokenInvitacion(token);
      setDatosInvitacion(datos);
      setNombre(datos.nombre || '');
      setApellido(datos.apellido || '');
      setTokenValido(true);
    } catch (err) {
      setTokenValido(false);
      setErrorToken(err.message || 'El enlace de invitación no es válido o ha expirado.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorForm('');

    // Validaciones frontend
    if (password.length < 8) {
      setErrorForm('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (password !== confirmarPassword) {
      setErrorForm('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      await completarRegistro({
        token,
        password,
        nombre: nombre.trim(),
        apellido: apellido.trim() || undefined,
      });
      setRegistroExitoso(true);
    } catch (err) {
      setErrorForm(err.message || 'Error al completar el registro.');
    } finally {
      setLoading(false);
    }
  };

  // --- Estados de UI ---

  // Cargando validación del token
  if (tokenValido === null) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Validando invitación...</span>
          </div>
          <p className="text-muted">Validando tu invitación...</p>
        </div>
      </div>
    );
  }

  // Token inválido o expirado
  if (tokenValido === false) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="col-md-6 col-lg-4 text-center">
          <div className="card shadow-sm border-0">
            <div className="card-body p-5">
              <i className="bi bi-x-circle-fill text-danger fs-1 mb-3 d-block"></i>
              <h4 className="mb-3">Invitación no válida</h4>
              <p className="text-muted mb-4">{errorToken}</p>
              <p className="text-muted small">
                Si crees que esto es un error, contacta al administrador de tu empresa para que reenvíe la invitación.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Registro completado exitosamente
  if (registroExitoso) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="col-md-6 col-lg-4 text-center">
          <div className="card shadow-sm border-0">
            <div className="card-body p-5">
              <i className="bi bi-check-circle-fill text-success fs-1 mb-3 d-block"></i>
              <h4 className="mb-2">¡Registro completado!</h4>
              <p className="text-muted mb-4">
                Tu cuenta ha sido creada exitosamente. Ya puedes ingresar con tu email y la contraseña que elegiste.
              </p>
              <button
                className="btn btn-primary w-100"
                onClick={() => navigate('/login')}
              >
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Ir al Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Formulario de registro
  return (
    <div className="min-vh-100 bg-light d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">

            {/* Header */}
            <div className="text-center mb-4">
              <i className="bi bi-file-earmark-text-fill text-primary fs-1"></i>
              <h2 className="mt-2 text-primary">Gestor F29</h2>
              <p className="text-muted">Completa tu registro para activar tu cuenta</p>
            </div>

            <div className="card shadow-sm border-0">
              <div className="card-body p-4">

                {/* Info de la invitación */}
                <div className="alert alert-info d-flex align-items-center mb-4" role="alert">
                  <i className="bi bi-envelope-open-fill me-2 flex-shrink-0"></i>
                  <div>
                    Fuiste invitado como <strong>{datosInvitacion?.email}</strong>
                    {datosInvitacion?.rol && (
                      <span className="ms-1">
                        con rol <strong className="text-capitalize">{datosInvitacion.rol}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {errorForm && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {errorForm}
                    <button type="button" className="btn-close" onClick={() => setErrorForm('')} aria-label="Cerrar"></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Nombre */}
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                      disabled={loading}
                      placeholder="Tu nombre"
                    />
                  </div>

                  {/* Apellido */}
                  <div className="mb-3">
                    <label htmlFor="apellido" className="form-label">Apellido</label>
                    <input
                      type="text"
                      className="form-control"
                      id="apellido"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      disabled={loading}
                      placeholder="Tu apellido (opcional)"
                    />
                  </div>

                  {/* Email — solo lectura, viene de la invitación */}
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control bg-light"
                      value={datosInvitacion?.email || ''}
                      readOnly
                    />
                    <div className="form-text">El email no se puede modificar.</div>
                  </div>

                  <hr className="my-3" />
                  <p className="text-muted small mb-3">
                    <i className="bi bi-shield-lock me-1"></i>
                    Elige una contraseña segura para tu cuenta. Mínimo 8 caracteres.
                  </p>

                  {/* Nueva contraseña */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña <span className="text-danger">*</span></label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      placeholder="Mínimo 8 caracteres"
                    />
                  </div>

                  {/* Confirmar contraseña */}
                  <div className="mb-4">
                    <label htmlFor="confirmarPassword" className="form-label">Confirmar contraseña <span className="text-danger">*</span></label>
                    <input
                      type="password"
                      className={`form-control ${confirmarPassword && password !== confirmarPassword ? 'is-invalid' : confirmarPassword && password === confirmarPassword ? 'is-valid' : ''}`}
                      id="confirmarPassword"
                      value={confirmarPassword}
                      onChange={(e) => setConfirmarPassword(e.target.value)}
                      required
                      disabled={loading}
                      placeholder="Repite tu contraseña"
                    />
                    {confirmarPassword && password !== confirmarPassword && (
                      <div className="invalid-feedback">Las contraseñas no coinciden.</div>
                    )}
                    {confirmarPassword && password === confirmarPassword && (
                      <div className="valid-feedback">Las contraseñas coinciden.</div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creando cuenta...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-check-fill me-2"></i>
                        Activar mi cuenta
                      </>
                    )}
                  </button>
                </form>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}