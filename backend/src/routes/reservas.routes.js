import { Router } from 'express';
import {
  obtenerReservas,
  obtenerReservaPorId,
  crearReservaController,
  actualizarReservaController,
  cambiarEstadoReserva,
  borrarReserva,
} from '../controllers/reservas.controller.js';
import validateId from '../middlewares/validateId.js';

const router = Router();

router.get('/', obtenerReservas);
router.get('/:id', validateId, obtenerReservaPorId);
router.post('/', crearReservaController);
router.put('/:id', validateId, actualizarReservaController);
router.patch('/:id/estado', validateId, cambiarEstadoReserva);
router.delete('/:id', validateId, borrarReserva);

export default router;
