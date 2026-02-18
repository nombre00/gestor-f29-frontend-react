// Página protegida: /perfil
// Muestra info del usuario y permite cambiar la contraseña.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/SideBar'
import { obtenerPerfil, cambiarPassword } from '../services/usuariosService';

const ROL_LABEL = {
  super: { texto: 'Super Admin', clase: 'bg-dark' },
  admin: { texto: 'Administrador', clase: 'bg-primary' },
  contador: { texto: 'Contador', clase: 'bg-info text-dark' },
};

export default function VistaPerfil() {
  const navigate = useNavigate();

  // Datos del usuario
  const [usuario, setUsuario] = useState(null);
  const [loadingPerfil, setLoadingPerfil] = useState(true);
  const [errorPerfil, setErrorPerfil] = useState('');

  // Formulario cambio de contraseña
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [errorPassword, setErrorPassword] = useState('');
  const [exitoPassword, setExitoPassword] = useState(false);

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      const datos = await obtenerPerfil();
      setUsuario(datos);
    } catch (err) {
      if (err.message?.includes('401') || err.message?.includes('403')) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      setErrorPerfil('No se pudo cargar la información del perfil.');
    } finally {
      setLoadingPerfil(false);
    }
  };

  const handleCambiarPassword = async (e) => {
    e.preventDefault();
    setErrorPassword('');
    setExitoPassword(false);

    // Validaciones
    if (passwordNueva.length < 8) {
      setErrorPassword('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (passwordNueva === passwordActual) {
      setErrorPassword('La nueva contraseña debe ser diferente a la actual.');
      return;
    }
    if (passwordNueva !== confirmarPassword) {
      setErrorPassword('Las contraseñas nuevas no coinciden.');
      return;
    }

    setLoadingPassword(true);
    try {
      await cambiarPassword({
        password_actual: passwordActual,
        password_nueva: passwordNueva,
      });
      setExitoPassword(true);
      // Limpiar formulario
      setPasswordActual('');
      setPasswordNueva('');
      setConfirmarPassword('');
    } catch (err) {
      setErrorPassword(err.message || 'Error al cambiar la contraseña.');
    } finally {
      setLoadingPassword(false);
    }
  };

  // --- Spinner de carga ---
  if (loadingPerfil) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-muted">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  // --- Error crítico ---
  if (errorPerfil) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {errorPerfil}
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>
          Volver al Login
        </button>
      </div>
    );
  }

  const rolInfo = ROL_LABEL[usuario?.rol] || { texto: usuario?.rol, clase: 'bg-secondary' };
  const nombreCompleto = [usuario?.nombre, usuario?.apellido].filter(Boolean).join(' ');
  const iniciales = [usuario?.nombre?.[0], usuario?.apellido?.[0]].filter(Boolean).join('').toUpperCase();

  return (
    <div className="bg-light min-vh-100">
      <Sidebar />

      <div style={{ marginLeft: '250px' }} className="p-4">
        <div className="container-fluid" style={{ maxWidth: '800px' }}>

          {/* Header */}
          <div className="mb-4">
            <h2 className="fw-bold text-dark mb-1">Mi Perfil</h2>
            <p className="text-muted mb-0">Información de tu cuenta y configuración de seguridad</p>
          </div>

          {/* Tarjeta de información personal */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-4">
                {/* Avatar con iniciales */}
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center flex-shrink-0 me-3"
                  style={{ width: '64px', height: '64px', fontSize: '1.5rem', fontWeight: 600 }}
                >
                  {iniciales || <i className="bi bi-person-fill"></i>}
                </div>
                <div>
                  <h5 className="mb-1 fw-semibold">{nombreCompleto}</h5>
                  <p className="text-muted mb-1 small">{usuario?.email}</p>
                  <span className={`badge ${rolInfo.clase}`}>{rolInfo.texto}</span>
                </div>
              </div>

              <hr />

              <h6 className="text-muted text-uppercase fw-semibold small mb-3">
                <i className="bi bi-person me-2"></i>Información personal
              </h6>

              <div className="row g-3">
                <div className="col-sm-6">
                  <label className="form-label text-muted small">Nombre</label>
                  <div className="form-control bg-light border-0">{usuario?.nombre || '—'}</div>
                </div>
                <div className="col-sm-6">
                  <label className="form-label text-muted small">Apellido</label>
                  <div className="form-control bg-light border-0">{usuario?.apellido || '—'}</div>
                </div>
                <div className="col-sm-8">
                  <label className="form-label text-muted small">Email</label>
                  <div className="form-control bg-light border-0">{usuario?.email}</div>
                </div>
                <div className="col-sm-4">
                  <label className="form-label text-muted small">Rol</label>
                  <div className="form-control bg-light border-0">{rolInfo.texto}</div>
                </div>
                {usuario?.ultimo_acceso && (
                  <div className="col-12">
                    <label className="form-label text-muted small">Último acceso</label>
                    <div className="form-control bg-light border-0">
                      {new Date(usuario.ultimo_acceso).toLocaleString('es-CL', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Tarjeta de cambio de contraseña */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h6 className="text-muted text-uppercase fw-semibold small mb-3">
                <i className="bi bi-shield-lock me-2"></i>Cambiar contraseña
              </h6>

              {exitoPassword && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  <strong>¡Contraseña actualizada correctamente!</strong>
                </div>
              )}

              {errorPassword && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {errorPassword}
                  <button type="button" className="btn-close" onClick={() => setErrorPassword('')} aria-label="Cerrar"></button>
                </div>
              )}

              <form onSubmit={handleCambiarPassword}>
                <div className="mb-3">
                  <label htmlFor="passwordActual" className="form-label">
                    Contraseña actual <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="passwordActual"
                    value={passwordActual}
                    onChange={(e) => setPasswordActual(e.target.value)}
                    required
                    disabled={loadingPassword}
                    placeholder="Tu contraseña actual"
                    autoComplete="current-password"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="passwordNueva" className="form-label">
                    Nueva contraseña <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="passwordNueva"
                    value={passwordNueva}
                    onChange={(e) => setPasswordNueva(e.target.value)}
                    required
                    disabled={loadingPassword}
                    placeholder="Mínimo 8 caracteres"
                    autoComplete="new-password"
                  />
                  {/* Indicador de fortaleza básico */}
                  {passwordNueva && (
                    <div className="mt-1">
                      <div className="progress" style={{ height: '4px' }}>
                        <div
                          className={`progress-bar ${
                            passwordNueva.length < 8 ? 'bg-danger w-25' :
                            passwordNueva.length < 12 ? 'bg-warning w-50' :
                            'bg-success w-100'
                          }`}
                        ></div>
                      </div>
                      <small className={`${
                        passwordNueva.length < 8 ? 'text-danger' :
                        passwordNueva.length < 12 ? 'text-warning' :
                        'text-success'
                      }`}>
                        {passwordNueva.length < 8 ? 'Muy corta' :
                         passwordNueva.length < 12 ? 'Aceptable' :
                         'Segura'}
                      </small>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmarPassword" className="form-label">
                    Confirmar nueva contraseña <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className={`form-control ${
                      confirmarPassword && passwordNueva !== confirmarPassword ? 'is-invalid' :
                      confirmarPassword && passwordNueva === confirmarPassword ? 'is-valid' : ''
                    }`}
                    id="confirmarPassword"
                    value={confirmarPassword}
                    onChange={(e) => setConfirmarPassword(e.target.value)}
                    required
                    disabled={loadingPassword}
                    placeholder="Repite la nueva contraseña"
                    autoComplete="new-password"
                  />
                  {confirmarPassword && passwordNueva !== confirmarPassword && (
                    <div className="invalid-feedback">Las contraseñas no coinciden.</div>
                  )}
                  {confirmarPassword && passwordNueva === confirmarPassword && (
                    <div className="valid-feedback">Las contraseñas coinciden.</div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loadingPassword}
                >
                  {loadingPassword ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Actualizando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-shield-check me-2"></i>
                      Actualizar contraseña
                    </>
                  )}
                </button>
              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}