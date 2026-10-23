import { obtenerResumenConsultas } from '../models/reservas.model.js';

export async function obtenerResumen() {
  return obtenerResumenConsultas();
}
