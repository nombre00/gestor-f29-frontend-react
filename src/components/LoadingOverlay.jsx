// Spiner para esperas de llamádas asíncronas.


export default function LoadingOverlay({ text = 'Procesando...' }) {
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
      style={{ zIndex: 9999 }}
    >
      <div className="card p-4 text-center bg-white shadow">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mb-0">{text}</p>
      </div>
    </div>
  )
}