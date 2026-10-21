const API_URL = 'http://localhost:3000/api';

async function request(endpoint, options = {}) {
  const respuesta = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.error || 'Ocurrió un error al comunicarse con la API');
  }

  return datos;
}

export const api = {
  obtenerResumen: () => request('/resumen'),

  obtenerClientes: () => request('/clientes'),
  crearCliente: (cliente) =>
    request('/clientes', {
      method: 'POST',
      body: JSON.stringify(cliente)
    }),

  obtenerMesas: () => request('/mesas'),

  obtenerReservas: () => request('/reservas'),
  obtenerReservaPorId: (id) => request(`/reservas/${id}`),
  crearReserva: (reserva) =>
    request('/reservas', {
      method: 'POST',
      body: JSON.stringify(reserva)
    }),


  cambiarEstadoReserva: (id, estado) =>
    request(`/reservas/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado })
    })
};
