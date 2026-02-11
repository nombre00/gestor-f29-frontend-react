// Home del programa, el usuario parte acá.
// Desde acá podemos ir a iniciar sesión.

export default function VistaInicio() {
  return (
    <div className="container my-5">
      <h1 className="text-primary mb-4">Bienvenido al Gestor F29</h1>
      
      <p className="lead text-muted">
        Selecciona una opción del menú lateral para comenzar.
      </p>
      
      <div className="alert alert-info mt-4">
        <i className="bi bi-info-circle me-2"></i>
        Aquí irá el dashboard con resumen de clientes y declaraciones cuando esté listo.
      </div>
    </div>
  )
}