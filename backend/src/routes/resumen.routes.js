import { Router } from 'express';
import { obtenerResumenController } from '../controllers/resumen.controller.js';

const router = Router();

router.get('/', obtenerResumenController);

export default router;