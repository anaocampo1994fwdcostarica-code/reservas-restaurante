import * as reservasService from '../services/reservas.service.js';

export async function obtenerReservas(req, res, next) {
  try { res.status(200).json(await reservasService.listarReservas()); } catch (error) { next(error); }
}

export async function obtenerReservaPorId(req, res, next) {
  try { res.status(200).json(await reservasService.buscarReservaPorId(req.params.id)); } catch (error) { next(error); }
}

export async function crearReservaController(req, res, next) {
  try { res.status(201).json(await reservasService.crearReserva(req.body)); } catch (error) { next(error); }
}

export async function actualizarReservaController(req, res, next) {
  try { res.status(200).json(await reservasService.actualizarReserva(req.params.id, req.body)); } catch (error) { next(error); }
}

export async function cambiarEstadoReserva(req, res, next) {
  try { res.status(200).json(await reservasService.cambiarEstado(req.params.id, req.body?.estado)); } catch (error) { next(error); }
}

export async function borrarReserva(req, res, next) {
  try {
    const reserva = await reservasService.eliminarReserva(req.params.id);
    res.status(200).json({ mensaje: 'Reserva eliminada correctamente', id: reserva.id });
  } catch (error) { next(error); }
}
