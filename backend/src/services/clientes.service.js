import * as clientesModel from '../models/clientes.model.js';

function crearError(mensaje, status) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

function normalizarDatos(datos) {
  const { nombre, telefono } = datos || {};
  if (typeof nombre !== 'string' || nombre.trim().length < 3 ||
      typeof telefono !== 'string' || telefono.trim().length < 8) {
    throw crearError(
      'Nombre y teléfono son obligatorios. El nombre debe tener al menos 3 caracteres.',
      400
    );
  }
  return { nombre: nombre.trim(), telefono: telefono.trim() };
}

function traducirErrorBaseDatos(error) {
  if (error.code === '23505') {
    throw crearError('Ya existe un cliente con ese número de teléfono', 409);
  }
  if (error.code === '23503') {
    throw crearError('No se puede eliminar el cliente porque tiene reservas asociadas', 409);
  }
  throw error;
}

export async function listarClientes() {
  return clientesModel.listar();
}

export async function buscarClientePorId(id) {
  const cliente = await clientesModel.buscarPorId(id);
  if (!cliente) throw crearError('Cliente no encontrado', 404);
  return cliente;
}

export async function crearCliente(datos) {
  try {
    return await clientesModel.crear(normalizarDatos(datos));
  } catch (error) {
    return traducirErrorBaseDatos(error);
  }
}

export async function actualizarCliente(id, datos) {
  try {
    const cliente = await clientesModel.actualizar(id, normalizarDatos(datos));
    if (!cliente) throw crearError('Cliente no encontrado', 404);
    return cliente;
  } catch (error) {
    return traducirErrorBaseDatos(error);
  }
}

export async function eliminarCliente(id) {
  try {
    const cliente = await clientesModel.eliminar(id);
    if (!cliente) throw crearError('Cliente no encontrado', 404);
    return cliente;
  } catch (error) {
    return traducirErrorBaseDatos(error);
  }
}
