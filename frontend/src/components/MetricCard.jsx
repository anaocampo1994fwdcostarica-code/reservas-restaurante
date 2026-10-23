import Icon from './Icon';
export default function MetricCard({ icono, valor, etiqueta, tono = 'default', detalle }) {
  return <article className={`metric-card metric-card--${tono}`}><div className="metric-card__icon"><Icon name={icono} size={21} /></div><div className="metric-card__content"><span>{etiqueta}</span><strong>{valor ?? 0}</strong>{detalle && <small>{detalle}</small>}</div></article>;
}
