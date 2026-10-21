import {
  listarMesas,
  buscarMesaPorId,
} from '../services/mesas.service.js';

export async function obtenerMesas(req, res) {
  try {
    const mesas = await listarMesas();
    res.status(200).json(mesas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las mesas' });
  }
}

export async function obtenerMesaPorId(req, res) {
  try {
    const mesa = await buscarMesaPorId(req.params.id);

    if (!mesa) {
      return res.status(404).json({ error: 'Mesa no encontrada' });
    }

    res.status(200).json(mesa);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la mesa' });
  }
}
