// Componente de input genérico reutilizable.
// Usado en: registrarCliente, ModalFormCliente.

const Campo = ({
  label,
  field,
  tipo = 'text',
  placeholder = '',
  requerido = false,
  value,
  onChange,
  disabled,
  onChangeFn,
  size = '',   // '' | 'sm' | 'lg'
}) => (
  <div className="mb-3">
    <label className="form-label fw-semibold">
      {label}
      {requerido && <span className="text-danger ms-1">*</span>}
    </label>
    <input
      type={tipo}
      className={`form-control${size ? ` form-control-${size}` : ''}`}
      placeholder={placeholder}
      value={value}
      onChange={e => (onChangeFn ?? onChange)(field, e.target.value)}
      required={requerido}
      disabled={disabled}
    />
  </div>
);

export default Campo;