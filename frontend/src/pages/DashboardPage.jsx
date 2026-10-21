import { api } from '../services/api';
import { useApi } from '../hooks/useApi';

export default function DashboardPage() {
  const { datos: resumen, cargando, error } = useApi(api.obtenerResumen);

  if (cargando) {
    return <p>Cargando resumen del restaurante...</p>;
  }

  if (error) {
    return <p className="mensaje-error">{error}</p>;
  }

  const totales = resumen.totales;

  return (
    <section>
      <h1>Dashboard</h1>
      <p>Resumen general de las reservas del restaurante.</p>

      <div className="tarjetas-resumen">
        <article className="tarjeta">
          <h2>{totales.total_reservas}</h2>
          <p>Reservas totales</p>
        </article>

        <article className="tarjeta">
          <h2>{totales.pendientes}</h2>
          <p>Reservas pendientes</p>
        </article>

        <article className="tarjeta">
          <h2>{totales.confirmadas}</h2>
          <p>Reservas confirmadas</p>
        </article>

        <article className="tarjeta">
          <h2>{totales.no_shows}</h2>
          <p>No-shows</p>
        </article>
      </div>

      <div className="panel">
        <h2>Mesas más reservadas</h2>

        <ul>
          {resumen.mesas_mas_reservadas.map((mesa) => (
            <li key={mesa.numero}>
              Mesa {mesa.numero} — {mesa.ubicacion}: {mesa.cantidad_reservas} reservas
            </li>
          ))}
        </ul>
      </div>

      <div className="panel">
        <h2>Clientes con ausencias</h2>

        {resumen.clientes_con_no_shows.length === 0 ? (
          <p>No hay clientes con ausencias registradas.</p>
        ) : (
          <ul>
            {resumen.clientes_con_no_shows.map((cliente) => (
              <li key={cliente.telefono}>
                {cliente.nombre}: {cliente.no_shows} no-show(s)
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
