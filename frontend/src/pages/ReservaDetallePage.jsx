import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { useApi } from '../hooks/useApi';
import EstadoBadge from '../components/EstadoBadge';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Icon from '../components/Icon';
import { obtenerIniciales } from '../utils/formato';

const transiciones = {
  pendiente: ['confirmada', 'cancelada'],
  confirmada: ['cumplida', 'cancelada', 'no_show'],
  cumplida: [], cancelada: [], no_show: []
};

const etiquetas = {
  confirmada: 'Confirmar reserva', cumplida: 'Marcar cumplida',
  cancelada: 'Cancelar reserva', no_show: 'Registrar no asistió'
};

const formularioVacio = { fecha: '', hora_inicio: '', mesa_id: '', personas: '', nota: '' };

export default function ReservaDetallePage() {
  const { id } = useParams();
  const { datos: reserva, cargando, error, recargar } = useApi(() => api.obtenerReservaPorId(id));
  const [actualizando, setActualizando] = useState('');
  const [mensajeEstado, setMensajeEstado] = useState('');
  const [errorEstado, setErrorEstado] = useState(false);
  const [editando, setEditando] = useState(false);
  const [formulario, setFormulario] = useState(formularioVacio);
  const [mesas, setMesas] = useState([]);
  const [cargandoMesas, setCargandoMesas] = useState(false);
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);
  const [mensajeEdicion, setMensajeEdicion] = useState('');
  const [errorEdicion, setErrorEdicion] = useState(false);

  const mesaSeleccionada = useMemo(
    () => mesas.find((mesa) => String(mesa.id) === String(formulario.mesa_id)),
    [mesas, formulario.mesa_id]
  );

  async function cambiarEstado(estado) {
    setActualizando(estado);
    setMensajeEstado('');
    setErrorEstado(false);
    try {
      await api.cambiarEstadoReserva(id, estado);
      await recargar();
      setMensajeEstado('Estado actualizado correctamente.');
    } catch (err) {
      setMensajeEstado(err.message);
      setErrorEstado(true);
    } finally {
      setActualizando('');
    }
  }

  async function iniciarEdicion() {
    if (reserva.estado !== 'pendiente') return;

    setFormulario({
      fecha: reserva.fecha?.slice(0, 10) || '',
      hora_inicio: reserva.hora_inicio?.slice(0, 5) || '',
      mesa_id: String(reserva.mesa_id),
      personas: String(reserva.personas),
      nota: reserva.nota || ''
    });
    setMesas([{ id: reserva.mesa_id, numero: reserva.mesa_numero, ubicacion: reserva.mesa_ubicacion, capacidad: reserva.mesa_capacidad, activa: true }]);
    setMensajeEdicion('');
    setErrorEdicion(false);
    setEditando(true);
    setCargandoMesas(true);

    try {
      const listaMesas = await api.obtenerMesas();
      setMesas(listaMesas.filter((mesa) => mesa.activa || String(mesa.id) === String(reserva.mesa_id)));
    } catch (err) {
      setMensajeEdicion(err.message);
      setErrorEdicion(true);
    } finally {
      setCargandoMesas(false);
    }
  }

  function cancelarEdicion() {
    setEditando(false);
    setFormulario(formularioVacio);
    setMensajeEdicion('');
    setErrorEdicion(false);
  }

  function cambiarCampo(evento) {
    const { name, value } = evento.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
  }

  async function guardarEdicion(evento) {
    evento.preventDefault();
    if (reserva.estado !== 'pendiente') return;

    setGuardandoEdicion(true);
    setMensajeEdicion('');
    setErrorEdicion(false);

    try {
      await api.actualizarReserva(id, {
        cliente_id: Number(reserva.cliente_id),
        mesa_id: Number(formulario.mesa_id),
        fecha: formulario.fecha,
        hora_inicio: formulario.hora_inicio,
        personas: Number(formulario.personas),
        nota: formulario.nota
      });
      await recargar();
      setEditando(false);
      setFormulario(formularioVacio);
      setMensajeEstado('Reserva actualizada correctamente.');
      setErrorEstado(false);
    } catch (err) {
      setMensajeEdicion(err.message);
      setErrorEdicion(true);
    } finally {
      setGuardandoEdicion(false);
    }
  }

  if (cargando) return <Loading texto="Abriendo la ficha de la reserva..." />;
  if (error) return <ErrorMessage mensaje={error} />;

  const opciones = transiciones[reserva.estado] || [];

  return (
    <div className="page-stack detail-page">
      <Link className="back-link" to="/reservas"><Icon name="back" size={17} /> Volver a reservas</Link>

      <section className="page-hero">
        <div><span className="eyebrow">FICHA OPERATIVA · #{reserva.id}</span><h1>Detalle de reserva</h1><p>Información confirmada para la coordinación del servicio.</p></div>
        <div className="detail-hero-actions">
          {reserva.estado === 'pendiente' && !editando && <button className="button button--ghost" type="button" onClick={iniciarEdicion}><Icon name="edit" size={16} /> Editar reserva</button>}
          <EstadoBadge estado={reserva.estado} />
        </div>
      </section>

      {mensajeEstado && <div className={`alert ${errorEstado ? 'alert--error' : 'alert--success'}`} role={errorEstado ? 'alert' : 'status'}><Icon name={errorEstado ? 'alert' : 'check'} size={18} /><span>{mensajeEstado}</span></div>}

      {editando && reserva.estado === 'pendiente' && (
        <section className="panel-card edit-reservation-card">
          <div className="panel-card__header">
            <div><span className="eyebrow"><Icon name="edit" size={14} /> EDICIÓN CONTROLADA</span><h2>Editar reserva pendiente</h2></div>
            <span className="count-pill">Duración automática: 2 horas</span>
          </div>

          <form className="edit-reservation-form" onSubmit={guardarEdicion}>
            <div className="form-grid edit-reservation-grid">
              <label>Fecha<input type="date" name="fecha" value={formulario.fecha} onChange={cambiarCampo} required /></label>
              <label>Hora de inicio<input type="time" name="hora_inicio" value={formulario.hora_inicio} onChange={cambiarCampo} required /></label>
              <label>Mesa<select name="mesa_id" value={formulario.mesa_id} onChange={cambiarCampo} required disabled={cargandoMesas}>{mesas.map((mesa) => <option key={mesa.id} value={mesa.id}>Mesa {mesa.numero} — {mesa.ubicacion} — capacidad {mesa.capacidad}</option>)}</select><small>{cargandoMesas ? 'Cargando mesas...' : 'Solo se muestran mesas disponibles para edición.'}</small></label>
              <label>Personas<input type="number" name="personas" min="1" max={mesaSeleccionada?.capacidad} value={formulario.personas} onChange={cambiarCampo} required /><small>{mesaSeleccionada ? `Capacidad máxima: ${mesaSeleccionada.capacidad}` : 'Selecciona una mesa.'}</small></label>
              <label className="field--full">Nota opcional<textarea name="nota" value={formulario.nota} onChange={cambiarCampo} placeholder="Indicaciones especiales para el servicio" /></label>
            </div>

            {mensajeEdicion && <div className={`alert ${errorEdicion ? 'alert--error' : 'alert--success'}`} role={errorEdicion ? 'alert' : 'status'}><Icon name={errorEdicion ? 'alert' : 'check'} size={18} /><span>{mensajeEdicion}</span></div>}

            <div className="form-actions">
              <button className="button button--ghost" type="button" onClick={cancelarEdicion} disabled={guardandoEdicion}>Cancelar</button>
              <button className="button button--primary" type="submit" disabled={guardandoEdicion || cargandoMesas}><Icon name="save" size={16} /> {guardandoEdicion ? 'Guardando...' : 'Guardar cambios'}</button>
            </div>
          </form>
        </section>
      )}

      <div className="detail-grid">
        <section className="panel-card guest-card"><div className="guest-card__header"><div className="avatar avatar--large">{obtenerIniciales(reserva.cliente_nombre)}</div><div><span className="eyebrow">CLIENTE</span><h2>{reserva.cliente_nombre}</h2><p><Icon name="phone" size={15} /> {reserva.cliente_telefono}</p></div></div>{Number(reserva.cliente_no_shows) > 0 && <div className="risk-notice"><Icon name="alert" size={18} /><div><strong>Historial de ausencias</strong><span>Ausencias previas: {reserva.cliente_no_shows}</span></div></div>}</section>
        <section className="panel-card detail-card"><div className="panel-card__header"><div><span className="eyebrow">RESERVA</span><h2>Datos del servicio</h2></div><Icon name="calendar" /></div><dl className="detail-list"><div><dt>Fecha</dt><dd>{reserva.fecha?.slice(0, 10)}</dd></div><div><dt>Horario</dt><dd>{reserva.hora_inicio?.slice(0, 5)} – {reserva.hora_fin?.slice(0, 5)}</dd></div><div><dt>Personas</dt><dd>{reserva.personas}</dd></div><div><dt>Mesa</dt><dd>Mesa {reserva.mesa_numero}</dd></div><div><dt>Ubicación</dt><dd>{reserva.mesa_ubicacion}</dd></div><div><dt>Capacidad</dt><dd>{reserva.mesa_capacidad} personas</dd></div></dl></section>
        <section className="panel-card note-card"><span className="eyebrow"><Icon name="note" size={15} /> NOTA DE SERVICIO</span><p>{reserva.nota || 'No se registraron indicaciones especiales para esta reserva.'}</p></section>
        <aside className="panel-card actions-card"><span className="eyebrow">ACCIONES SEGURAS</span><h2>Actualizar estado</h2><p>Solo se muestran las transiciones permitidas para el estado actual.</p>{opciones.length ? <div className="action-buttons">{opciones.map((opcion) => <button key={opcion} type="button" disabled={Boolean(actualizando)} onClick={() => cambiarEstado(opcion)} className={`button button--state button--${opcion}`}>{actualizando === opcion ? 'Actualizando...' : etiquetas[opcion]}</button>)}</div> : <div className="closed-state"><Icon name="check" size={18} /> Esta reserva ya está cerrada.</div>}</aside>
      </div>
    </div>
  );
}
