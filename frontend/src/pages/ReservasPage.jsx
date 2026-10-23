import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useApi } from '../hooks/useApi';
import ReservaItem from '../components/ReservaItem';
import AvailabilityStrip from '../components/AvailabilityStrip';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Icon from '../components/Icon';

async function obtenerAgendaCompleta() {
  const [reservas, clientes] = await Promise.all([api.obtenerReservas(), api.obtenerClientes()]);
  return { reservas, clientes };
}

function fechaHoraComparable(reserva) {
  return `${String(reserva.fecha).slice(0, 10)}T${String(reserva.hora_inicio).slice(0, 8)}`;
}

export default function ReservasPage() {
  const { datos, cargando, error } = useApi(obtenerAgendaCompleta);
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState('todas');
  const [orden, setOrden] = useState('fecha_asc');
  const reservas = useMemo(() => datos.reservas || [], [datos.reservas]);
  const clientes = useMemo(() => datos.clientes || [], [datos.clientes]);
  const noShowsPorCliente = useMemo(() => new Map(clientes.map((cliente) => [cliente.id, cliente.no_shows])), [clientes]);

  const reservasProcesadas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    const filtradas = reservas.filter((reserva) => {
      const coincideBusqueda = !texto ||
        reserva.cliente_nombre.toLowerCase().includes(texto) ||
        String(reserva.mesa_numero).includes(texto) ||
        (reserva.cliente_telefono || '').includes(texto);
      return coincideBusqueda && (estado === 'todas' || reserva.estado === estado);
    });

    return filtradas.sort((reservaA, reservaB) => {
      if (orden === 'fecha_desc') return fechaHoraComparable(reservaB).localeCompare(fechaHoraComparable(reservaA));
      if (orden === 'cliente_asc') return reservaA.cliente_nombre.localeCompare(reservaB.cliente_nombre, 'es', { sensitivity: 'base' });
      if (orden === 'mesa_asc') return Number(reservaA.mesa_numero) - Number(reservaB.mesa_numero);
      return fechaHoraComparable(reservaA).localeCompare(fechaHoraComparable(reservaB));
    });
  }, [reservas, busqueda, estado, orden]);

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div><span className="eyebrow">OPERACIÓN DE SALA</span><h1>Agenda de reservas</h1><p>Consulta llegadas, filtra estados, ordena la agenda y accede a cada ficha operativa.</p></div>
        <Link className="button button--primary" to="/nueva-reserva"><Icon name="plus" size={18} /> Nueva reserva</Link>
      </section>

      <section className="panel-card reservations-panel">
        <div className="filters-bar reservations-filters">
          <label className="search-field"><Icon name="search" size={18} /><span className="sr-only">Buscar reservas</span><input type="search" value={busqueda} onChange={(evento) => setBusqueda(evento.target.value)} placeholder="Buscar cliente, teléfono o mesa..." /></label>
          <label className="filter-field"><span>Estado</span><select value={estado} onChange={(evento) => setEstado(evento.target.value)}><option value="todas">Todos los estados</option><option value="pendiente">Pendiente</option><option value="confirmada">Confirmada</option><option value="cumplida">Cumplida</option><option value="cancelada">Cancelada</option><option value="no_show">No asistió</option></select></label>
          <label className="filter-field sort-field"><span>Ordenar por</span><select value={orden} onChange={(evento) => setOrden(evento.target.value)}><option value="fecha_asc">Fecha y hora: más próxima</option><option value="fecha_desc">Fecha y hora: más lejana</option><option value="cliente_asc">Cliente: A a Z</option><option value="mesa_asc">Mesa: menor a mayor</option></select></label>
          <span className="result-count">{reservasProcesadas.length} resultados</span>
        </div>

        {cargando && <Loading texto="Consultando las reservas..." />}
        {error && <ErrorMessage mensaje={error} />}

        {!cargando && !error && (
          <div className="table-scroll">
            <table className="data-table"><thead><tr><th>Hora</th><th>Cliente</th><th>Personas</th><th>Mesa / Zona</th><th>Estado</th><th>Nota</th><th>Acción</th></tr></thead><tbody>{reservasProcesadas.map((reserva) => <ReservaItem key={reserva.id} reserva={reserva} noShows={noShowsPorCliente.get(reserva.cliente_id)} />)}</tbody></table>
            {reservasProcesadas.length === 0 && <div className="empty-state"><Icon name="search" size={28} /><strong>Sin coincidencias</strong><p>Ajusta la búsqueda, el filtro de estado o el orden.</p></div>}
          </div>
        )}
      </section>

      {!cargando && !error && <AvailabilityStrip reservas={reservas} />}
    </div>
  );
}
