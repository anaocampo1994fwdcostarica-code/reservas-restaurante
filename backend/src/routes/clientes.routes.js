import { Router } from 'express';
import {
  obtenerClientes,
  obtenerClientePorId,
  crearClienteController,
  actualizarClienteController,
  borrarCliente,
} from '../controllers/clientes.controller.js';

const router = Router();

router.get('/', obtenerClientes);
router.get('/:id', obtenerClientePorId);
router.post('/', crearClienteController);
router.put('/:id', actualizarClienteController);
router.delete('/:id', borrarCliente);

export default router;