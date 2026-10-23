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

async function consultarAsistenteIA(consulta) {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error(
      'Falta configurar VITE_N8N_WEBHOOK_URL en frontend/.env para consultar el asistente.'
    );
  }

  let response;
  try {
    response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ consulta })
    });
  } catch {
    throw new Error(
      'No fue posible conectar con el asistente. Verifica que n8n esté activo y permita CORS desde http://localhost:5173.'
    );
  }

  let datos;
  try {
    datos = await response.json();
  } catch {
    throw new Error('El asistente devolvió una respuesta JSON que no se pudo interpretar.');
  }

  if (!response.ok) {
    throw new Error(
      datos?.error || `El asistente respondió con el estado HTTP ${response.status}.`
    );
  }

  if (datos?.ok !== true || datos?.error !== null) {
    throw new Error(datos?.error || 'El asistente devolvió un contrato de respuesta inválido.');
  }

  const textoRespuesta = datos?.data?.respuesta;
  if (typeof textoRespuesta !== 'string' || !textoRespuesta.trim()) {
    throw new Error('El asistente respondió sin información de disponibilidad.');
  }

  return textoRespuesta;
}

export const api = {
  consultarAsistenteIA,
  obtenerResumen: () => request('/resumen'),

  obtenerClientes: () => request('/clientes'),
  crearCliente: (cliente) =>
    request('/clientes', {
      method: 'POST',
      body: JSON.stringify(cliente)
    }),
  actualizarCliente: (id, cliente) =>
    request(`/clientes/${id}`, {
      method: 'PUT',
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
  actualizarReserva: (id, reserva) =>
    request(`/reservas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reserva)
    }),

  cambiarEstadoReserva: (id, estado) =>
    request(`/reservas/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado })
    })
};
