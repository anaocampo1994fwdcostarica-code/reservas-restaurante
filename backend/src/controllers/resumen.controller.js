import { obtenerResumen } from '../services/resumen.service.js';

export async function obtenerResumenController(req, res, next) {
  try { res.status(200).json(await obtenerResumen()); } catch (error) { next(error); }
}
