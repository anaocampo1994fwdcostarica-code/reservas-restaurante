import { api } from '../services/api';
import { useApi } from '../hooks/useApi';
import ErrorMessage from '../components/ErrorMessage';
import Icon from '../components/Icon';
import Loading from '../components/Loading';
import MetricCard from '../components/MetricCard';
import fachadaCasonaLaly from '../assets/restaurante/fachada-casona-laly.png';

export default function DashboardPage() {
  const { datos: resumen, cargando, error } = useApi(api.obtenerResumen);

  if (cargando) {
    return <Loading texto="Preparando el resumen del restaurante..." />;
  }

  if (error) {
    return <ErrorMessage mensaje={error} />;
  }

  const totales = resumen.totales ?? {};
  const ocupacionPorFranja = resumen.ocupacion_por_franja ?? [];
  const mesasMasReservadas = resumen.mesas_mas_reservadas ?? [];
  const clientesConNoShows = resumen.clientes_con_no_shows ?? [];

  return (
    <div className="page-stack dashboard-summary">
      <section className="restaurant-welcome-banner" aria-label="Bienvenida a La Casona de Laly">
        <img src={fachadaCasonaLaly} alt="Fachada nocturna de La Casona de Laly" />
        <div className="restaurant-welcome-banner__overlay" />
        <div className="restaurant-welcome-banner__content">
          <span className="eyebrow">CONTROL EN TIEMPO REAL</span>
          <h1>Bienvenida, Ana</h1>
          <p>Gestiona el servicio de La Casona de Laly en tiempo real.</p>
        </div>
      </section>

      <section className="metrics-grid" aria-label="Métricas de reservas">
        <MetricCard
          icono="calendar"
          valor={totales.total_reservas}
          etiqueta="Reservas totales"
          tono="default"
          detalle="Registro general"
        />
        <MetricCard
          icono="clock"
          valor={totales.pendientes}
          etiqueta="Pendientes"
          tono="warning"
          detalle="Requieren atención"
        />
        <MetricCard
          icono="check"
          valor={totales.confirmadas}
          etiqueta="Confirmadas"
          tono="success"
          detalle="Listas para recibir"
        />
        <MetricCard
          icono="alert"
          valor={totales.no_shows}
          etiqueta="Ausencias"
          tono="danger"
          detalle="Ausencias registradas"
        />
      </section>

      <section className="panel-card occupancy-card">
        <div className="dashboard-agenda__title">
          <div>
            <span className="eyebrow">
              <Icon name="clock" size={15} /> OCUPACIÓN DE HOY
            </span>
            <h2>Ocupación del día por franja horaria</h2>
          </div>
          <span className="live-badge"><span /> Datos actuales</span>
        </div>

        {ocupacionPorFranja.length === 0 ? (
          <div className="empty-state">
            <Icon name="calendar" size={30} />
            <strong>No hay ocupación registrada</strong>
            <p>Las franjas aparecerán aquí cuando existan reservas para hoy.</p>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="data-table occupancy-table">
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Reservas</th>
                  <th>Activas</th>
                  <th>Personas esperadas</th>
                  <th>Mesas ocupadas</th>
                </tr>
              </thead>
              <tbody>
                {ocupacionPorFranja.map((franja) => (
                  <tr key={franja.franja_horaria}>
                    <td>
                      <span className="occupancy-time">
                        <Icon name="clock" size={15} />
                        {franja.franja_horaria.slice(0, 5)}
                      </span>
                    </td>
                    <td><span className="occupancy-value">{franja.reservas_en_franja}</span></td>
                    <td><span className="occupancy-value occupancy-value--active">{franja.reservas_activas}</span></td>
                    <td>{franja.personas_esperadas}</td>
                    <td>{franja.mesas_ocupadas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="insights-stack dashboard-insights" aria-label="Información destacada">
        <article className="panel-card insight-card">
          <div className="insight-card__icon"><Icon name="trend" size={20} /></div>
          <span className="eyebrow">ACTIVIDAD POR MESA</span>
          <h2>Mesas más reservadas</h2>

          {mesasMasReservadas.length === 0 ? (
            <div className="compact-empty">
              <Icon name="table" size={20} />
              <span>No hay actividad registrada.</span>
            </div>
          ) : (
            <ol className="rank-list">
              {mesasMasReservadas.map((mesa, indice) => (
                <li key={mesa.numero}>
                  <span>{indice + 1}</span>
                  <div>
                    <strong>Mesa {mesa.numero}</strong>
                    <small>{mesa.ubicacion}</small>
                  </div>
                  <b>{mesa.cantidad_reservas}</b>
                </li>
              ))}
            </ol>
          )}
        </article>

        <article className="panel-card attention-card">
          <div className="attention-card__icon"><Icon name="alert" size={20} /></div>
          <span className="eyebrow">SEGUIMIENTO DE CLIENTES</span>
          <h2>Clientes con ausencias</h2>

          {clientesConNoShows.length === 0 ? (
            <div className="all-good">
              <Icon name="check" size={17} />
              Sin ausencias registradas
            </div>
          ) : (
            <ul>
              {clientesConNoShows.map((cliente) => (
                <li key={cliente.telefono}>
                  <div>
                    <strong>{cliente.nombre}</strong>
                    <span>{cliente.telefono}</span>
                  </div>
                  <span className="risk-badge">Ausencias previas: {cliente.no_shows}</span>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>

    </div>
  );
}
