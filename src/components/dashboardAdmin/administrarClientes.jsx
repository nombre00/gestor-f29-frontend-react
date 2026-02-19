// Pestaña de gestión de clientes del dashboard admin.
// CRUD completo: listar, crear, editar, desactivar y reasignar clientes.
// Consume: GET|POST|PUT /api/clientes, GET /api/resumenes/dashboard, GET /api/usuarios.

// Pestaña de gestión de clientes del dashboard admin.
// Este componente solo maneja estado y lógica.
// La presentación está delegada en ModalFormCliente y ModalReasignar.

import { useState, useEffect, useCallback } from 'react';
import {
  obtenerClientes,
  crearCliente,
  actualizarCliente,
  desactivarCliente,
  reasignarCliente,
} from '../../services/clienteService';
import { obtenerDashboardContador } from '../../services/resumenesService';
import ModalFormCliente from './ModalFormCliente';
import ModalReasignar   from './ModalReasignar';
import api from '../../api/api';


// ── Sub-componentes de presentación local ────────────────────────────────────

const BadgeF29 = ({ clienteId, idsConF29 }) =>
  idsConF29.has(clienteId)
    ? <span className="badge bg-success"><i className="bi bi-check-circle-fill me-1"></i>Hecho</span>
    : <span className="badge bg-warning text-dark"><i className="bi bi-clock-fill me-1"></i>Pendiente</span>;

const BadgeEstado = ({ activo }) =>
  activo
    ? <span className="badge bg-success-subtle text-success border border-success-subtle">Activo</span>
    : <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle">Inactivo</span>;


// ── Componente principal ──────────────────────────────────────────────────────

export default function AdministrarClientes() {
  const [clientes,   setClientes]   = useState([]);
  const [contadores, setContadores] = useState([]);
  const [idsConF29,  setIdsConF29]  = useState(new Set());
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');

  // null | 'crear' | objeto cliente → controla ModalFormCliente.
  const [modalForm,      setModalForm]      = useState(null);
  // null | objeto cliente → controla ModalReasignar.
  const [modalReasignar, setModalReasignar] = useState(null);
  const [modalLoading,   setModalLoading]   = useState(false);

  // ── Carga de datos ────────────────────────────────────────────────────────

  const fetchTodo = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [dataClientes, dataUsuarios, dataDashboard] = await Promise.all([
        obtenerClientes(),
        api.get('/api/usuarios'),
        obtenerDashboardContador({}),
      ]);

      setClientes(dataClientes.clientes ?? []);

      setContadores(
        (dataUsuarios.data.usuarios ?? []).filter(u => u.rol === 'contador' && u.activo)
      );

      setIdsConF29(
        new Set((dataDashboard.resumenes_hechos ?? []).map(r => r.cliente_id))
      );
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTodo(); }, [fetchTodo]);

  // ── Acciones ──────────────────────────────────────────────────────────────

  const handleGuardar = async (payload) => {
    setModalLoading(true);
    try {
      if (modalForm === 'crear') {
        await crearCliente(payload);
      } else {
        await actualizarCliente(modalForm.id, payload);
      }
      setModalForm(null);
      fetchTodo();
    } catch (err) {
      alert(err.response?.data?.detail || err.message || 'Error al guardar');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDesactivar = async (cliente) => {
    if (!confirm(`¿Desactivar a "${cliente.razon_social}"?`)) return;
    setLoading(true);
    try {
      await desactivarCliente(cliente.id);
      fetchTodo();
    } catch (err) {
      alert(err.response?.data?.detail || err.message || 'Error al desactivar');
    } finally {
      setLoading(false);
    }
  };

  const handleReasignar = async (nuevoUsuarioId) => {
    setModalLoading(true);
    try {
      await reasignarCliente(modalReasignar.id, nuevoUsuarioId);
      setModalReasignar(null);
      fetchTodo();
    } catch (err) {
      alert(err.response?.data?.detail || err.message || 'Error al reasignar');
    } finally {
      setModalLoading(false);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────

  const nombreContador = (id) => {
    const u = contadores.find(c => c.id === id);
    return u ? `${u.nombre} ${u.apellido ?? ''}`.trim() : '—';
  };

  const activos   = clientes.filter(c => c.activo);
  const inactivos = clientes.filter(c => !c.activo);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="container-fluid py-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary mb-0">
          <i className="bi bi-building me-2"></i>
          Gestión de Clientes
        </h2>
        <button
          className="btn btn-primary"
          onClick={() => setModalForm('crear')}
          disabled={loading}
        >
          <i className="bi bi-building-add me-2"></i>
          Nuevo Cliente
        </button>
      </div>

      {/* Error global */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
          <button className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {/* ── Tabla clientes activos ──────────────────────────────────── */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-success text-white py-3">
          <h5 className="mb-0">
            <i className="bi bi-check-circle-fill me-2"></i>
            Clientes Activos ({activos.length})
          </h5>
        </div>
        <div className="card-body p-0">
          {loading && clientes.length === 0 ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted small">Cargando clientes...</p>
            </div>
          ) : activos.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox fs-1 d-block mb-2"></i>
              <p>No hay clientes activos. Crea el primero.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Razón Social</th>
                    <th>Contador asignado</th>
                    <th className="text-center">Estado</th>
                    <th className="text-center">F29 este mes</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {activos.map(c => (
                    <tr key={c.id}>
                      <td>
                        <div className="fw-semibold">
                          <i className="bi bi-building me-2 text-primary"></i>
                          {c.razon_social}
                        </div>
                        <div className="text-muted small ms-4">{c.rut}</div>
                      </td>
                      <td>
                        <i className="bi bi-person-fill me-1 text-muted"></i>
                        {nombreContador(c.asignado_a_usuario_id)}
                      </td>
                      <td className="text-center">
                        <BadgeEstado activo={c.activo} />
                      </td>
                      <td className="text-center">
                        <BadgeF29 clienteId={c.id} idsConF29={idsConF29} />
                      </td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            title="Editar"
                            onClick={() => setModalForm(c)}
                            disabled={loading}
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button
                            className="btn btn-outline-warning"
                            title="Reasignar contador"
                            onClick={() => setModalReasignar(c)}
                            disabled={loading}
                          >
                            <i className="bi bi-arrow-left-right"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            title="Desactivar"
                            onClick={() => handleDesactivar(c)}
                            disabled={loading}
                          >
                            <i className="bi bi-x-circle-fill"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Tabla clientes inactivos ────────────────────────────────── */}
      {inactivos.length > 0 && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-secondary text-white py-3">
            <h5 className="mb-0">
              <i className="bi bi-dash-circle-fill me-2"></i>
              Clientes Inactivos ({inactivos.length})
            </h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Razón Social</th>
                    <th>Contador asignado</th>
                    <th className="text-center">Estado</th>
                    <th className="text-center">F29 este mes</th>
                  </tr>
                </thead>
                <tbody>
                  {inactivos.map(c => (
                    <tr key={c.id} className="table-secondary text-muted">
                      <td>
                        <div className="fw-semibold">
                          <i className="bi bi-building me-2"></i>
                          {c.razon_social}
                        </div>
                        <div className="small ms-4">{c.rut}</div>
                      </td>
                      <td>{nombreContador(c.asignado_a_usuario_id)}</td>
                      <td className="text-center"><BadgeEstado activo={c.activo} /></td>
                      <td className="text-center"><BadgeF29 clienteId={c.id} idsConF29={idsConF29} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Modales ─────────────────────────────────────────────────── */}
      {modalForm !== null && (
        <ModalFormCliente
          cliente={modalForm === 'crear' ? null : modalForm}
          contadores={contadores}
          onGuardar={handleGuardar}
          onCerrar={() => setModalForm(null)}
          loading={modalLoading}
        />
      )}

      {modalReasignar !== null && (
        <ModalReasignar
          cliente={modalReasignar}
          contadores={contadores}
          onReasignar={handleReasignar}
          onCerrar={() => setModalReasignar(null)}
          loading={modalLoading}
        />
      )}

    </div>
  );
}