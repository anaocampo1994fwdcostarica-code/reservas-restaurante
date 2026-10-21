import { api } from '../services/api';
import { useApi } from '../hooks/useApi';

export default function MesasPage() {
  const { datos: mesas, cargando, error } = useApi(api.obtenerMesas);

  return (
    <section>
      <h1>Mesas</h1>
      <p>Consulta las mesas disponibles y su capacidad.</p>

      {cargando && <p>Cargando mesas...</p>}
      {error && <p className="mensaje-error">{error}</p>}

      {!cargando && !error && (
        <div className="tarjetas-mesas">
          {mesas.map((mesa) => (
            <article className="tarjeta" key={mesa.id}>
              <h2>Mesa {mesa.numero}</h2>
              <p><strong>Ubicación:</strong> {mesa.ubicacion}</p>
              <p><strong>Capacidad:</strong> {mesa.capacidad} personas</p>
              <p>
                <strong>Estado:</strong>{' '}
                {mesa.activa ? 'Activa' : 'Inactiva'}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}