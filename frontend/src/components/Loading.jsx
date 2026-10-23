export default function Loading({ texto = 'Cargando información...' }) {
  return <div className="state-card" role="status"><span className="spinner" /><div><strong>Un momento</strong><p>{texto}</p></div></div>;
}
