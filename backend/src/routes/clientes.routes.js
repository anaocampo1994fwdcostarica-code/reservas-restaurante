import { Router } from 'express';
import {
  obtenerClientes,
  obtenerClientePorId,
  crearClienteController,
  actualizarClienteController,
  borrarCliente,
} from '../controllers/clientes.controller.js';
import validateId from '../middlewares/validateId.js';

const router = Router();

router.get('/', obtenerClientes);
router.get('/:id', validateId, obtenerClientePorId);
router.post('/', crearClienteController);
router.put('/:id', validateId, actualizarClienteController);
router.delete('/:id', validateId, borrarCliente);

export default router;
