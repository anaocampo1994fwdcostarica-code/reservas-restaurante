import {
  listarClientes,
  buscarClientePorId,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
} from '../services/clientes.service.js';

function datosValidos(nombre, telefono) {
  return (
    typeof nombre === 'string' &&
    nombre.trim().length >= 3 &&
    typeof telefono === 'string' &&
    telefono.trim().length >= 8
  );
}

export async function obtenerClientes(req, res) {
  try {
    const clientes = await listarClientes();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los clientes' });
  }
}

export async function obtenerClientePorId(req, res) {
  try {
    const cliente = await buscarClientePorId(req.params.id);

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el cliente' });
  }
}

export async function crearClienteController(req, res) {
  try {
    const { nombre, telefono } = req.body;

    if (!datosValidos(nombre, telefono)) {
      return res.status(400).json({
        error: 'Nombre y teléfono son obligatorios. El nombre debe tener al menos 3 caracteres.',
      });
    }

    const cliente = await crearCliente(nombre.trim(), telefono.trim());
    res.status(201).json(cliente);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        error: 'Ya existe un cliente con ese número de teléfono',
      });
    }

    res.status(500).json({ error: 'Error al crear el cliente' });
  }
}

export async function actualizarClienteController(req, res) {
  try {
    const { nombre, telefono } = req.body;

    if (!datosValidos(nombre, telefono)) {
      return res.status(400).json({
        error: 'Nombre y teléfono son obligatorios. El nombre debe tener al menos 3 caracteres.',
      });
    }

    const cliente = await actualizarCliente(
      req.params.id,
      nombre.trim(),
      telefono.trim()
    );

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.status(200).json(cliente);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        error: 'Ya existe un cliente con ese número de teléfono',
      });
    }

    res.status(500).json({ error: 'Error al actualizar el cliente' });
  }
}

export async function borrarCliente(req, res) {
  try {
    const cliente = await eliminarCliente(req.params.id);

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.status(200).json({
      mensaje: 'Cliente eliminado correctamente',
      id: cliente.id,
    });
  } catch (error) {
    if (error.code === '23503') {
      return res.status(409).json({
        error: 'No se puede eliminar el cliente porque tiene reservas asociadas',
      });
    }

    res.status(500).json({ error: 'Error al eliminar el cliente' });
  }
}