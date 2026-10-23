import * as mesasService from '../services/mesas.service.js';

export async function obtenerMesas(req, res, next) {
  try { res.status(200).json(await mesasService.listarMesas()); } catch (error) { next(error); }
}

export async function obtenerMesaPorId(req, res, next) {
  try { res.status(200).json(await mesasService.buscarMesaPorId(req.params.id)); } catch (error) { next(error); }
}
