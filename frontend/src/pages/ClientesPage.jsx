import { useState } from 'react';
import { api } from '../services/api';
import { useApi } from '../hooks/useApi';

export default function ClientesPage() {
  const { datos: clientes, cargando, error, recargar } = useApi(api.obtenerClientes);

  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [guardando, setGuardando] = useState(false);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setMensaje('');

    try {
      setGuardando(true);

      await api.crearCliente({ nombre, telefono });

      setNombre('');
      setTelefono('');
      setMensaje('Cliente creado correctamente.');
      await recargar();
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <section>
      <h1>Clientes</h1>
      <p>Registra y consulta los clientes del restaurante.</p>

      <form className="formulario" onSubmit={manejarEnvio}>
        <h2>Nuevo cliente</h2>

        <label>
          Nombre completo
          <input
            type="text"
            value={nombre}
            onChange={(evento) => setNombre(evento.target.value)}
            placeholder="Ejemplo: Laura Gómez"
            required
          />
        </label>

        <label>
          Teléfono
          <input
            type="text"
            value={telefono}
            onChange={(evento) => setTelefono(evento.target.value)}
            placeholder="8888-4444"
            required
          />
        </label>

        <button type="submit" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar cliente'}
        </button>

        {mensaje && <p className="mensaje">{mensaje}</p>}
      </form>

      <div className="panel">
        <h2>Lista de clientes</h2>

        {cargando && <p>Cargando clientes...</p>}
        {error && <p className="mensaje-error">{error}</p>}

        {!cargando && !error && (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>No-shows</th>
              </tr>
            </thead>

            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.telefono}</td>
                  <td>{cliente.no_shows}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
