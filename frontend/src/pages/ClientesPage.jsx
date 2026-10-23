import { useState } from 'react';
import { api } from '../services/api';
import { useApi } from '../hooks/useApi';
import { obtenerIniciales } from '../utils/formato';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Icon from '../components/Icon';

const formularioVacio = { nombre: '', telefono: '' };

export default function ClientesPage() {
  const { datos: clientes, cargando, error, recargar } = useApi(api.obtenerClientes);
  const [formulario, setFormulario] = useState(formularioVacio);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [esError, setEsError] = useState(false);
  const [guardando, setGuardando] = useState(false);

  function cambiarCampo(evento) {
    const { name, value } = evento.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
  }

  function iniciarEdicion(cliente) {
    setClienteEditando(cliente.id);
    setFormulario({ nombre: cliente.nombre, telefono: cliente.telefono });
    setMensaje('');
    setEsError(false);
  }

  function cancelarEdicion() {
    setClienteEditando(null);
    setFormulario(formularioVacio);
    setMensaje('');
    setEsError(false);
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setMensaje('');
    setEsError(false);
    setGuardando(true);

    try {
      if (clienteEditando) {
        await api.actualizarCliente(clienteEditando, formulario);
        setMensaje('Cliente actualizado correctamente.');
      } else {
        await api.crearCliente(formulario);
        setMensaje('Cliente creado correctamente.');
      }

      setClienteEditando(null);
      setFormulario(formularioVacio);
      await recargar();
    } catch (err) {
      setMensaje(err.message);
      setEsError(true);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <span className="eyebrow">DIRECTORIO</span>
          <h1>Clientes</h1>
          <p>Administra los contactos y consulta su historial de asistencia.</p>
        </div>
      </section>

      <div className="clients-layout">
        <section className="panel-card clients-list">
          <div className="panel-card__header">
            <div><span className="eyebrow">REGISTROS</span><h2>Directorio de clientes</h2></div>
            {!cargando && <span className="count-pill">{clientes.length} clientes</span>}
          </div>

          {cargando && <Loading texto="Cargando el directorio..." />}
          {error && <ErrorMessage mensaje={error} />}

          {!cargando && !error && (
            <div className="table-scroll">
              <table className="data-table clients-table">
                <thead><tr><th>Cliente</th><th>Teléfono</th><th>Historial</th><th>Acción</th></tr></thead>
                <tbody>
                  {clientes.map((cliente) => (
                    <tr key={cliente.id} className={clienteEditando === cliente.id ? 'row--selected' : ''}>
                      <td><div className="person-cell"><span className="avatar">{obtenerIniciales(cliente.nombre)}</span><strong>{cliente.nombre}</strong></div></td>
                      <td><span className="with-icon"><Icon name="phone" size={16} />{cliente.telefono}</span></td>
                      <td>{Number(cliente.no_shows) > 0 ? <span className="risk-badge">Ausencias previas: {cliente.no_shows}</span> : <span className="clean-badge"><Icon name="check" size={13} /> Sin ausencias</span>}</td>
                      <td><button className="table-action" type="button" onClick={() => iniciarEdicion(cliente)} aria-label={`Editar cliente ${cliente.nombre}`}><Icon name="edit" size={15} /> Editar</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {clientes.length === 0 && <div className="empty-state"><Icon name="users" size={28} /><strong>Aún no hay clientes</strong><p>Registra el primero desde el formulario.</p></div>}
            </div>
          )}
        </section>

        <aside className="panel-card create-client">
          <span className="eyebrow"><Icon name={clienteEditando ? 'edit' : 'plus'} size={15} /> {clienteEditando ? 'EDITAR REGISTRO' : 'NUEVO REGISTRO'}</span>
          <h2>{clienteEditando ? 'Editar cliente' : 'Agregar cliente'}</h2>
          <p>{clienteEditando ? 'Actualiza únicamente el nombre o teléfono del cliente.' : 'Guarda sus datos para agilizar futuras reservas.'}</p>

          <form className="stack-form" onSubmit={manejarEnvio}>
            <label>Nombre completo<input name="nombre" type="text" value={formulario.nombre} onChange={cambiarCampo} placeholder="Ej. Laura Gómez" required /></label>
            <label>Teléfono<input name="telefono" type="tel" value={formulario.telefono} onChange={cambiarCampo} placeholder="8888-4444" required /></label>

            <button className="button button--primary button--full" type="submit" disabled={guardando}>
              <Icon name="save" size={17} />
              {guardando ? 'Guardando...' : clienteEditando ? 'Guardar cambios' : 'Guardar cliente'}
            </button>

            {clienteEditando && <button className="button button--ghost button--full" type="button" onClick={cancelarEdicion} disabled={guardando}>Cancelar edición</button>}
            {mensaje && <div className={`alert ${esError ? 'alert--error' : 'alert--success'}`} role={esError ? 'alert' : 'status'}><Icon name={esError ? 'alert' : 'check'} size={17} /><span>{mensaje}</span></div>}
          </form>
        </aside>
      </div>
    </div>
  );
}
