// Dashboard del contador para gestionar clientes.

export default function DashboardContador({ usuario }) {
  return (
    <div className="container-fluid py-4">
      {/* Bienvenida */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm border-0 bg-gradient" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div className="card-body text-white p-4">
              <h2 className="mb-2">
                <i className="bi bi-emoji-smile me-2"></i>
                ¡Bienvenido, {usuario.nombre}!
              </h2>
              <p className="mb-0 opacity-75">
                Usa el menú lateral para navegar entre las diferentes secciones del sistema
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de acceso rápido */}
      <div className="row g-4">
        {/* Card: Generar F29 */}
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm h-100 border-0 hover-shadow">
            <div className="card-body text-center py-5">
              <div className="mb-3">
                <i className="bi bi-file-earmark-plus-fill text-primary" style={{ fontSize: '3rem' }}></i>
              </div>
              <h5 className="card-title">Generar F29</h5>
              <p className="card-text text-muted">
                Crea un nuevo resumen del Formulario 29 para tus clientes
              </p>
              <a href="/gestor" className="btn btn-primary">
                <i className="bi bi-arrow-right-circle me-2"></i>
                Ir al Gestor
              </a>
            </div>
          </div>
        </div>

        {/* Card: Resumen Anual */}
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm h-100 border-0 hover-shadow">
            <div className="card-body text-center py-5">
              <div className="mb-3">
                <i className="bi bi-graph-up-arrow text-success" style={{ fontSize: '3rem' }}></i>
              </div>
              <h5 className="card-title">Resumen Anual</h5>
              <p className="card-text text-muted">
                Visualiza y genera reportes anuales consolidados
              </p>
              <a href="/resumen-anual" className="btn btn-success">
                <i className="bi bi-arrow-right-circle me-2"></i>
                Ver Resúmenes
              </a>
            </div>
          </div>
        </div>

        {/* Card: Registrar Empresa */}
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm h-100 border-0 hover-shadow">
            <div className="card-body text-center py-5">
              <div className="mb-3">
                <i className="bi bi-building-add text-info" style={{ fontSize: '3rem' }}></i>
              </div>
              <h5 className="card-title">Registrar Empresa</h5>
              <p className="card-text text-muted">
                Agrega una nueva empresa cliente al sistema
              </p>
              <a href="/registrar-empresa" className="btn btn-info">
                <i className="bi bi-arrow-right-circle me-2"></i>
                Registrar
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de información útil */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <i className="bi bi-lightbulb-fill text-warning me-2"></i>
                Información Útil
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <h6 className="text-primary">
                    <i className="bi bi-calendar-check me-2"></i>
                    Plazos F29
                  </h6>
                  <p className="text-muted small mb-0">
                    El Formulario 29 se presenta mensualmente hasta el día 12 del mes siguiente (o día hábil siguiente si es feriado)
                  </p>
                </div>
                <div className="col-md-4 mb-3">
                  <h6 className="text-success">
                    <i className="bi bi-file-earmark-text me-2"></i>
                    Documentos Necesarios
                  </h6>
                  <p className="text-muted small mb-0">
                    Libro de Compras, Libro de Ventas, Centralizaciones de Remuneraciones y Honorarios
                  </p>
                </div>
                <div className="col-md-4 mb-3">
                  <h6 className="text-info">
                    <i className="bi bi-info-circle me-2"></i>
                    Soporte
                  </h6>
                  <p className="text-muted small mb-0">
                    Si tienes dudas o problemas, contacta al administrador del sistema
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS personalizado inline para el hover effect */}
      <style>{`
        .hover-shadow {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
    </div>
  );
}