import { api } from '../services/api';
import { useApi } from '../hooks/useApi';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Icon from '../components/Icon';

export default function MesasPage() {
  const { datos: mesas, cargando, error } = useApi(api.obtenerMesas);
  return <div className="page-stack"><section className="page-hero"><div><span className="eyebrow">CONFIGURACIÓN DE SALA</span><h1>Mesas</h1><p>Consulta la distribución, capacidad y estado operativo de cada mesa.</p></div>{!cargando && <span className="count-pill">{mesas.filter((m) => m.activa).length} activas de {mesas.length}</span>}</section>
    {cargando && <Loading texto="Preparando el mapa de mesas..." />}{error && <ErrorMessage mensaje={error} />}
    {!cargando && !error && <section className="tables-grid">{mesas.map((mesa) => <article className={`table-card ${mesa.activa ? '' : 'table-card--inactive'}`} key={mesa.id}><div className="table-card__top"><span className="table-number">{mesa.numero}</span><span className={`badge ${mesa.activa ? 'badge--confirmada' : 'badge--cancelada'}`}>{mesa.activa ? 'Activa' : 'Inactiva'}</span></div><div><span className="eyebrow">MESA</span><h2>Mesa {mesa.numero}</h2></div><div className="table-card__meta"><span><Icon name="pin" size={17} />{mesa.ubicacion}</span><span><Icon name="people" size={17} />Hasta {mesa.capacidad} personas</span></div></article>)}</section>}
  </div>;
}
