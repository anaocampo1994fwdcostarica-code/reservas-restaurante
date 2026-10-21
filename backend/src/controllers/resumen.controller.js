import { obtenerResumen } from '../services/resumen.service.js';

export async function obtenerResumenController(req, res) {
  try {
    const resumen = await obtenerResumen();

    res.status(200).json(resumen);
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener el resumen del restaurante'
    });
  }
}
