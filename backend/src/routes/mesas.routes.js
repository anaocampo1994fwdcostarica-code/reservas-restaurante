import { Router } from 'express';
import {
  obtenerMesas,
  obtenerMesaPorId,
} from '../controllers/mesas.controller.js';

const router = Router();

router.get('/', obtenerMesas);
router.get('/:id', obtenerMesaPorId);

export default router;