import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function NuevaReservaPage() {
  const [clientes, setClientes] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [guardando, setGuardando] = useState(false);

  const [formulario, setFormulario] = useState({
    cliente_id: '',
    mesa_id: '',
    fecha: '',
    hora_inicio: '',
    personas: '',
    nota: ''
  });

  useEffect(() => {
    async function cargarOpciones() {
      try {
        const [listaClientes, listaMesas] = await Promise.all([
          api.obtenerClientes(),
          api.obtenerMesas()
        ]);

        setClientes(listaClientes);
        setMesas(listaMesas.filter((mesa) => mesa.activa));
      } catch (error) {
        setMensaje(error.message);
      }
    }

    cargarOpciones();
  }, []);

  function cambiarCampo(evento) {
    const { name, value } = evento.target;

    setFormulario({
      ...formulario,
      [name]: value
    });
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setMensaje('');

    try {
      setGuardando(true);

      const reserva = await api.crearReserva({
        ...formulario,
        cliente_id: Number(formulario.cliente_id),
        mesa_id: Number(formulario.mesa_id),
        personas: Number(formulario.personas)
      });

      setMensaje(`Reserva #${reserva.id} creada correctamente.`);
      setFormulario({
        cliente_id: '',
        mesa_id: '',
        fecha: '',
        hora_inicio: '',
        personas: '',
        nota: ''
      });
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <section>
      <h1>Nueva reserva</h1>
      <p>La duración se calcula automáticamente en 2 horas.</p>

      <form className="formulario" onSubmit={manejarEnvio}>
        <label>
          Cliente
          <select
            name="cliente_id"
            value={formulario.cliente_id}
            onChange={cambiarCampo}
            required
          >
            <option value="">Seleccione un cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombre} — {cliente.telefono}
              </option>
            ))}
          </select>
        </label>

        <label>
          Mesa
          <select
            name="mesa_id"
            value={formulario.mesa_id}
            onChange={cambiarCampo}
            required
          >
            <option value="">Seleccione una mesa</option>
            {mesas.map((mesa) => (
              <option key={mesa.id} value={mesa.id}>
                Mesa {mesa.numero} — {mesa.ubicacion} — capacidad {mesa.capacidad}
              </option>
            ))}
          </select>
        </label>

        <label>
          Fecha
          <input
            type="date"
            name="fecha"
            value={formulario.fecha}
            onChange={cambiarCampo}
            required
          />
        </label>

        <label>
          Hora de inicio
          <input
            type="time"
            name="hora_inicio"
            value={formulario.hora_inicio}
            onChange={cambiarCampo}
            required
          />
        </label>

        <label>
          Cantidad de personas
          <input
            type="number"
            name="personas"
            min="1"
            value={formulario.personas}
            onChange={cambiarCampo}
            required
          />
        </label>

        <label>
          Nota opcional
          <textarea
            name="nota"
            value={formulario.nota}
            onChange={cambiarCampo}
            placeholder="Ejemplo: celebración de cumpleaños"
          />
        </label>

        <button type="submit" disabled={guardando}>
          {guardando ? 'Creando reserva...' : 'Crear reserva'}
        </button>

        {mensaje && <p className="mensaje">{mensaje}</p>}
      </form>
    </section>
  );
}
