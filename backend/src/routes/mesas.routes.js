import { Router } from 'express';
import {
  obtenerMesas,
  obtenerMesaPorId,
} from '../controllers/mesas.controller.js';
import validateId from '../middlewares/validateId.js';

const router = Router();

router.get('/', obtenerMesas);
router.get('/:id', validateId, obtenerMesaPorId);

export default router;
