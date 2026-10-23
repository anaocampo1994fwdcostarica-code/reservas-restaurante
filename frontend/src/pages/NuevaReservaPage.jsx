import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import Icon from '../components/Icon';

export default function NuevaReservaPage() {
  const [clientes, setClientes] = useState([]); const [mesas, setMesas] = useState([]);
  const [mensaje, setMensaje] = useState(''); const [esError, setEsError] = useState(false); const [guardando, setGuardando] = useState(false);
  const [formulario, setFormulario] = useState({ cliente_id: '', mesa_id: '', fecha: '', hora_inicio: '', personas: '', nota: '' });
  useEffect(() => { async function cargarOpciones() { try { const [listaClientes, listaMesas] = await Promise.all([api.obtenerClientes(), api.obtenerMesas()]); setClientes(listaClientes); setMesas(listaMesas.filter((mesa) => mesa.activa)); } catch (err) { setMensaje(err.message); setEsError(true); } } cargarOpciones(); }, []);
  const mesaSeleccionada = useMemo(() => mesas.find((mesa) => String(mesa.id) === formulario.mesa_id), [mesas, formulario.mesa_id]);
  function cambiarCampo(e) { const { name, value } = e.target; setFormulario((actual) => ({ ...actual, [name]: value })); }
  async function manejarEnvio(e) { e.preventDefault(); setMensaje(''); setEsError(false); setGuardando(true); try { const reserva = await api.crearReserva({ ...formulario, cliente_id: Number(formulario.cliente_id), mesa_id: Number(formulario.mesa_id), personas: Number(formulario.personas) }); setMensaje(`Reserva #${reserva.id} creada correctamente.`); setFormulario({ cliente_id: '', mesa_id: '', fecha: '', hora_inicio: '', personas: '', nota: '' }); } catch (err) { setMensaje(err.message); setEsError(true); } finally { setGuardando(false); } }
  return <div className="page-stack"><Link className="back-link" to="/reservas"><Icon name="back" size={17} /> Volver a reservas</Link><section className="page-hero"><div><span className="eyebrow">NUEVA OPERACIÓN</span><h1>Crear una reserva</h1><p>Completa los datos del cliente, la mesa y el horario del servicio.</p></div></section>
    <form className="reservation-form" onSubmit={manejarEnvio}>
      <section className="panel-card form-section"><div className="form-section__heading"><span>01</span><div><h2>Datos del cliente</h2><p>Selecciona un contacto registrado.</p></div></div><label>Cliente<select name="cliente_id" value={formulario.cliente_id} onChange={cambiarCampo} required><option value="">Seleccione un cliente</option>{clientes.map((cliente) => <option key={cliente.id} value={cliente.id}>{cliente.nombre} — {cliente.telefono}</option>)}</select></label></section>
      <section className="panel-card form-section"><div className="form-section__heading"><span>02</span><div><h2>Datos de la mesa</h2><p>Solo se muestran mesas activas.</p></div></div><div className="form-grid"><label>Mesa<select name="mesa_id" value={formulario.mesa_id} onChange={cambiarCampo} required><option value="">Seleccione una mesa</option>{mesas.map((mesa) => <option key={mesa.id} value={mesa.id}>Mesa {mesa.numero} — {mesa.ubicacion} — capacidad {mesa.capacidad}</option>)}</select></label><label>Cantidad de personas<input type="number" name="personas" min="1" max={mesaSeleccionada?.capacidad} value={formulario.personas} onChange={cambiarCampo} required /><small>{mesaSeleccionada ? `Capacidad máxima: ${mesaSeleccionada.capacidad}` : 'Selecciona una mesa para ver su capacidad'}</small></label></div></section>
      <section className="panel-card form-section"><div className="form-section__heading"><span>03</span><div><h2>Detalles de la reserva</h2><p>La duración se calcula automáticamente en 2 horas.</p></div></div><div className="form-grid"><label>Fecha<input type="date" name="fecha" value={formulario.fecha} onChange={cambiarCampo} required /></label><label>Hora de inicio<input type="time" name="hora_inicio" value={formulario.hora_inicio} onChange={cambiarCampo} required /></label><label className="field--full">Nota opcional<textarea name="nota" value={formulario.nota} onChange={cambiarCampo} placeholder="Ej. celebración de cumpleaños, silla para bebé..." /></label></div></section>
      {mensaje && <div className={`alert ${esError ? 'alert--error' : 'alert--success'}`}><Icon name={esError ? 'alert' : 'check'} size={18} /><span>{mensaje}</span></div>}
      <div className="form-actions"><Link className="button button--ghost" to="/reservas">Cancelar</Link><button className="button button--primary" type="submit" disabled={guardando}><Icon name="save" size={17} />{guardando ? 'Creando reserva...' : 'Crear reserva'}</button></div>
    </form>
  </div>;
}
