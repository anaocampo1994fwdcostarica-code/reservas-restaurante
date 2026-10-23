import pool from '../db.js';
import * as clientesModel from '../models/clientes.model.js';
import * as mesasModel from '../models/mesas.model.js';
import * as horariosModel from '../models/horarios.model.js';
import * as reservasModel from '../models/reservas.model.js';

function crearError(mensaje, status = 409) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

function calcularHoraFin(horaInicio) {
  const coincidencia = /^(\d{2}):(\d{2})$/.exec(horaInicio || '');
  if (!coincidencia) return null;

  const horas = Number(coincidencia[1]);
  const minutos = Number(coincidencia[2]);
  const totalMinutos = horas * 60 + minutos + 120;
  if (horas > 23 || minutos > 59 || totalMinutos >= 24 * 60) return null;

  return `${String(Math.floor(totalMinutos / 60)).padStart(2, '0')}:${String(totalMinutos % 60).padStart(2, '0')}`;
}

function prepararDatos(datos) {
  const clienteId = Number(datos?.cliente_id);
  const mesaId = Number(datos?.mesa_id);
  const personas = Number(datos?.personas);
  const fecha = datos?.fecha;
  const horaInicio = datos?.hora_inicio;
  const horaFin = calcularHoraFin(horaInicio);

  if (!Number.isInteger(clienteId) || !Number.isInteger(mesaId) ||
      !Number.isInteger(personas) || personas < 1 ||
      !/^\d{4}-\d{2}-\d{2}$/.test(fecha || '') || !horaFin) {
    throw crearError(
      'Datos inválidos. Se requieren cliente_id, mesa_id, fecha, hora_inicio y personas.',
      400
    );
  }

  return { clienteId, mesaId, personas, fecha, horaInicio, horaFin, nota: datos.nota };
}

async function validarDatosReserva(datos, reservaId = null) {
  const cliente = await clientesModel.buscarPorId(datos.clienteId);
  if (!cliente) throw crearError('Cliente no encontrado', 404);
  if (cliente.no_shows >= 3) {
    throw crearError('El cliente tiene 3 o más no-shows y no puede reservar');
  }

  const mesa = await mesasModel.buscarPorId(datos.mesaId);
  if (!mesa) throw crearError('Mesa no encontrada', 404);
  if (!mesa.activa) throw crearError('La mesa seleccionada no está activa');
  if (datos.personas > mesa.capacidad) {
    throw crearError('La cantidad de personas supera la capacidad de la mesa');
  }

  const diaSemana = new Date(`${datos.fecha}T12:00:00`).getDay();
  const horario = await horariosModel.buscarPorDiaSemana(diaSemana);
  if (!horario) {
    throw crearError('El restaurante no tiene horario de atención para ese día');
  }
  if (datos.horaInicio < horario.apertura || datos.horaFin > horario.cierre) {
    throw crearError(`La reserva debe estar dentro del horario de atención: ${horario.apertura} a ${horario.cierre}`);
  }

  const existeCruce = await reservasModel.existeCruceActivo({ ...datos, reservaId });
  if (existeCruce) {
    throw crearError('La mesa ya tiene una reserva activa que se cruza con ese horario');
  }
}

export async function listarReservas() {
  return reservasModel.listar();
}

export async function buscarReservaPorId(id) {
  const reserva = await reservasModel.buscarPorId(id);
  if (!reserva) throw crearError('Reserva no encontrada', 404);
  return reserva;
}

export async function crearReserva(datosEntrada) {
  const datos = prepararDatos(datosEntrada);
  await validarDatosReserva(datos);
  return reservasModel.crear(datos);
}

export async function actualizarReserva(id, datosEntrada) {
  const existente = await reservasModel.buscarPorId(id);
  if (!existente) throw crearError('Reserva no encontrada', 404);
  if (existente.estado !== 'pendiente') {
    throw crearError('Solo se pueden editar reservas en estado pendiente');
  }

  const datos = prepararDatos(datosEntrada);
  await validarDatosReserva(datos, id);
  return reservasModel.actualizar(id, datos);
}

export async function cambiarEstado(id, nuevoEstado) {
  const estadosValidos = ['pendiente', 'confirmada', 'cumplida', 'cancelada', 'no_show'];
  if (!estadosValidos.includes(nuevoEstado)) throw crearError('Estado no válido', 400);

  const cliente = await pool.connect();
  try {
    await cliente.query('BEGIN');
    const reserva = await reservasModel.buscarParaActualizarEstado(id, cliente);
    if (!reserva) throw crearError('Reserva no encontrada', 404);

    const transicionesPermitidas = {
      pendiente: ['confirmada', 'cancelada'],
      confirmada: ['cumplida', 'cancelada', 'no_show'],
      cumplida: [], cancelada: [], no_show: []
    };
    if (!transicionesPermitidas[reserva.estado].includes(nuevoEstado)) {
      throw crearError(`No se permite cambiar el estado de "${reserva.estado}" a "${nuevoEstado}"`);
    }

    const actualizada = await reservasModel.actualizarEstado(id, nuevoEstado, cliente);
    if (nuevoEstado === 'no_show') {
      await clientesModel.incrementarNoShows(reserva.cliente_id, cliente);
    }
    await cliente.query('COMMIT');
    return actualizada;
  } catch (error) {
    await cliente.query('ROLLBACK');
    throw error;
  } finally {
    cliente.release();
  }
}

export async function eliminarReserva(id) {
  const reserva = await reservasModel.eliminar(id);
  if (!reserva) throw crearError('Reserva no encontrada', 404);
  return reserva;
}
