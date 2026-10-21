import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useApi } from '../hooks/useApi';

export default function ReservasPage() {
  const { datos: reservas, cargando, error } = useApi(api.obtenerReservas);
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState('todas');

  const reservasFiltradas = useMemo(() => {
    return reservas.filter((reserva) => {
      const texto = busqueda.toLowerCase();

      const coincideBusqueda =
        reserva.cliente_nombre.toLowerCase().includes(texto) ||
        String(reserva.mesa_numero).includes(texto);

      const coincideEstado =
        estado === 'todas' || reserva.estado === estado;

      return coincideBusqueda && coincideEstado;
    });
  }, [reservas, busqueda, estado]);

  return (
    <section>
      <h1>Reservas</h1>
      <p>Consulta, filtra y revisa el detalle de cada reserva.</p>

      <div className="filtros">
        <input
          type="text"
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
          placeholder="Buscar por cliente o mesa"
        />

        <select
          value={estado}
          onChange={(evento) => setEstado(evento.target.value)}
        >
          <option value="todas">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="confirmada">Confirmada</option>
          <option value="cumplida">Cumplida</option>
          <option value="cancelada">Cancelada</option>
          <option value="no_show">No-show</option>
        </select>
      </div>

      {cargando && <p>Cargando reservas...</p>}
      {error && <p className="mensaje-error">{error}</p>}

      {!cargando && !error && (
        <div className="panel">
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Mesa</th>
                <th>Fecha</th>
                <th>Horario</th>
                <th>Personas</th>
                <th>Estado</th>
                <th>Detalle</th>
              </tr>
            </thead>

            <tbody>
              {reservasFiltradas.map((reserva) => (
                <tr key={reserva.id}>
                  <td>{reserva.cliente_nombre}</td>
                  <td>Mesa {reserva.mesa_numero}</td>
                  <td>{reserva.fecha.slice(0, 10)}</td>
                  <td>
                    {reserva.hora_inicio.slice(0, 5)} - {reserva.hora_fin.slice(0, 5)}
                  </td>
                  <td>{reserva.personas}</td>
                  <td>{reserva.estado}</td>
                  <td>
                    <Link to={`/reservas/${reserva.id}`}>Ver detalle</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {reservasFiltradas.length === 0 && (
            <p>No hay reservas que coincidan con los filtros.</p>
          )}
        </div>
      )}
    </section>
  );
}