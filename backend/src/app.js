import express from 'express';
import cors from 'cors';
import pool from './db.js';
import clientesRoutes from './routes/clientes.routes.js';
import mesasRoutes from './routes/mesas.routes.js';
import reservasRoutes from './routes/reservas.routes.js';
import resumenRoutes from './routes/resumen.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensaje: 'API de reservas funcionando' });
});

app.get('/api/salud', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT NOW() AS fecha_servidor');

    res.json({
      ok: true,
      mensaje: 'Conexión exitosa con PostgreSQL',
      fechaServidor: resultado.rows[0].fecha_servidor,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: 'No fue posible conectar con PostgreSQL',
    });
  }
});

app.use('/api/clientes', clientesRoutes);
app.use('/api/mesas', mesasRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/resumen', resumenRoutes);

export default app;