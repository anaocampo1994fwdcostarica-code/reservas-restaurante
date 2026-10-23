import * as mesasModel from '../models/mesas.model.js';

function crearError(mensaje, status) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

export async function listarMesas() {
  return mesasModel.listar();
}

export async function buscarMesaPorId(id) {
  const mesa = await mesasModel.buscarPorId(id);
  if (!mesa) throw crearError('Mesa no encontrada', 404);
  return mesa;
}
