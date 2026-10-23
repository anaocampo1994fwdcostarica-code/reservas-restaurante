import * as clientesService from '../services/clientes.service.js';

export async function obtenerClientes(req, res, next) {
  try { res.status(200).json(await clientesService.listarClientes()); } catch (error) { next(error); }
}

export async function obtenerClientePorId(req, res, next) {
  try { res.status(200).json(await clientesService.buscarClientePorId(req.params.id)); } catch (error) { next(error); }
}

export async function crearClienteController(req, res, next) {
  try { res.status(201).json(await clientesService.crearCliente(req.body)); } catch (error) { next(error); }
}

export async function actualizarClienteController(req, res, next) {
  try { res.status(200).json(await clientesService.actualizarCliente(req.params.id, req.body)); } catch (error) { next(error); }
}

export async function borrarCliente(req, res, next) {
  try {
    const cliente = await clientesService.eliminarCliente(req.params.id);
    res.status(200).json({ mensaje: 'Cliente eliminado correctamente', id: cliente.id });
  } catch (error) { next(error); }
}
