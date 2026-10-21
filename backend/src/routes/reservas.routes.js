import { Router } from 'express';
import {
  obtenerReservas,
  obtenerReservaPorId,
  crearReservaController,
  actualizarReservaController,
  cambiarEstadoReserva,
  borrarReserva,
} from '../controllers/reservas.controller.js';

const router = Router();

router.get('/', obtenerReservas);
router.get('/:id', obtenerReservaPorId);
router.post('/', crearReservaController);
router.put('/:id', actualizarReservaController);
router.patch('/:id/estado', cambiarEstadoReserva);
router.delete('/:id', borrarReserva);

export default router;