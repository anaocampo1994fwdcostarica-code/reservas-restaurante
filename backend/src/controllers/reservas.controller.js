import {
  listarReservas,
  buscarReservaPorId,
  crearReserva,
  actualizarReserva,
  cambiarEstado,
  eliminarReserva,
} from '../services/reservas.service.js';

function calcularHoraFin(horaInicio) {
  const coincidencia = /^(\d{2}):(\d{2})$/.exec(horaInicio);

  if (!coincidencia) return null;

  const horas = Number(coincidencia[1]);
  const minutos = Number(coincidencia[2]);
  const totalMinutos = horas * 60 + minutos + 120;

  if (horas > 23 || minutos > 59 || totalMinutos >= 24 * 60) {
    return null;
  }

  const horaFinal = String(Math.floor(totalMinutos / 60)).padStart(2, '0');
  const minutoFinal = String(totalMinutos % 60).padStart(2, '0');

  return `${horaFinal}:${minutoFinal}`;
}

function prepararDatos(body) {
  const clienteId = Number(body.cliente_id);
  const mesaId = Number(body.mesa_id);
  const personas = Number(body.personas);
  const fecha = body.fecha;
  const horaInicio = body.hora_inicio;
  const horaFin = calcularHoraFin(horaInicio);

  if (
    !Number.isInteger(clienteId) ||
    !Number.isInteger(mesaId) ||
    !Number.isInteger(personas) ||
    personas < 1 ||
    !/^\d{4}-\d{2}-\d{2}$/.test(fecha || '') ||
    !horaFin
  ) {
    return null;
  }

  return {
    clienteId,
    mesaId,
    personas,
    fecha,
    horaInicio,
    horaFin,
    nota: body.nota,
  };
}

function responderError(error, res, mensajeGeneral) {
  if (error.status) {
    return res.status(error.status).json({ error: error.message });
  }

  res.status(500).json({ error: mensajeGeneral });
}

export async function obtenerReservas(req, res) {
  try {
    const reservas = await listarReservas();
    res.status(200).json(reservas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las reservas' });
  }
}

export async function obtenerReservaPorId(req, res) {
  try {
    const reserva = await buscarReservaPorId(req.params.id);

    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    res.status(200).json(reserva);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la reserva' });
  }
}

export async function crearReservaController(req, res) {
  const datos = prepararDatos(req.body);

  if (!datos) {
    return res.status(400).json({
      error: 'Datos inválidos. Se requieren cliente_id, mesa_id, fecha, hora_inicio y personas.',
    });
  }

  try {
    const reserva = await crearReserva(datos);
    res.status(201).json(reserva);
  } catch (error) {
    responderError(error, res, 'Error al crear la reserva');
  }
}

export async function actualizarReservaController(req, res) {
  const datos = prepararDatos(req.body);

  if (!datos) {
    return res.status(400).json({
      error: 'Datos inválidos. Se requieren cliente_id, mesa_id, fecha, hora_inicio y personas.',
    });
  }

  try {
    const reserva = await actualizarReserva(req.params.id, datos);
    res.status(200).json(reserva);
  } catch (error) {
    responderError(error, res, 'Error al actualizar la reserva');
  }
}

export async function cambiarEstadoReserva(req, res) {
  const { estado } = req.body;
  const estadosValidos = [
    'pendiente',
    'confirmada',
    'cumplida',
    'cancelada',
    'no_show',
  ];

  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ error: 'Estado no válido' });
  }

  try {
    const reserva = await cambiarEstado(req.params.id, estado);
    res.status(200).json(reserva);
  } catch (error) {
    responderError(error, res, 'Error al cambiar el estado');
  }
}

export async function borrarReserva(req, res) {
  try {
    const reserva = await eliminarReserva(req.params.id);

    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    res.status(200).json({
      mensaje: 'Reserva eliminada correctamente',
      id: reserva.id,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la reserva' });
  }
}
