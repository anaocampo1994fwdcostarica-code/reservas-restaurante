import pool from '../db.js';

const columnasReserva = `
  r.id, r.fecha, r.hora_inicio, r.hora_fin, r.personas, r.estado, r.nota,
  r.fecha_creacion, c.id AS cliente_id, c.nombre AS cliente_nombre,
  c.telefono AS cliente_telefono, m.id AS mesa_id, m.numero AS mesa_numero,
  m.ubicacion AS mesa_ubicacion`;

export async function listar(executor = pool) {
  const resultado = await executor.query(`
    SELECT ${columnasReserva}
    FROM reservas r
    JOIN clientes c ON c.id = r.cliente_id
    JOIN mesas m ON m.id = r.mesa_id
    ORDER BY r.fecha ASC, r.hora_inicio ASC
  `);
  return resultado.rows;
}

export async function buscarPorId(id, executor = pool) {
  const resultado = await executor.query(`
    SELECT ${columnasReserva}, c.no_shows AS cliente_no_shows,
      m.capacidad AS mesa_capacidad
    FROM reservas r
    JOIN clientes c ON c.id = r.cliente_id
    JOIN mesas m ON m.id = r.mesa_id
    WHERE r.id = $1
  `, [id]);
  return resultado.rows[0];
}

export async function buscarParaActualizarEstado(id, executor) {
  const resultado = await executor.query(
    'SELECT * FROM reservas WHERE id = $1 FOR UPDATE',
    [id]
  );
  return resultado.rows[0];
}

export async function existeCruceActivo({ mesaId, fecha, horaInicio, horaFin, reservaId }, executor = pool) {
  const valores = [mesaId, fecha, horaInicio, horaFin];
  let consulta = `
    SELECT id FROM reservas
    WHERE mesa_id = $1 AND fecha = $2
      AND estado IN ('pendiente', 'confirmada')
      AND hora_inicio < $4 AND hora_fin > $3`;

  if (reservaId) {
    valores.push(reservaId);
    consulta += ' AND id <> $5';
  }

  const resultado = await executor.query(consulta, valores);
  return resultado.rowCount > 0;
}

export async function crear(datos, executor = pool) {
  const resultado = await executor.query(
    `INSERT INTO reservas (cliente_id, mesa_id, fecha, hora_inicio, hora_fin, personas, nota)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [datos.clienteId, datos.mesaId, datos.fecha, datos.horaInicio, datos.horaFin, datos.personas, datos.nota || null]
  );
  return resultado.rows[0];
}

export async function actualizar(id, datos, executor = pool) {
  const resultado = await executor.query(
    `UPDATE reservas SET cliente_id = $1, mesa_id = $2, fecha = $3,
      hora_inicio = $4, hora_fin = $5, personas = $6, nota = $7
     WHERE id = $8 RETURNING *`,
    [datos.clienteId, datos.mesaId, datos.fecha, datos.horaInicio, datos.horaFin, datos.personas, datos.nota || null, id]
  );
  return resultado.rows[0];
}

export async function actualizarEstado(id, estado, executor) {
  const resultado = await executor.query(
    'UPDATE reservas SET estado = $1 WHERE id = $2 RETURNING *',
    [estado, id]
  );
  return resultado.rows[0];
}

export async function eliminar(id, executor = pool) {
  const resultado = await executor.query(
    'DELETE FROM reservas WHERE id = $1 RETURNING id',
    [id]
  );
  return resultado.rows[0];
}

export async function obtenerResumenConsultas(executor = pool) {
  const [totales, porEstado, mesasPopulares, clientesNoShow, ocupacionPorFranja] = await Promise.all([
    executor.query(`SELECT COUNT(*) AS total_reservas,
      COUNT(*) FILTER (WHERE estado = 'pendiente') AS pendientes,
      COUNT(*) FILTER (WHERE estado = 'confirmada') AS confirmadas,
      COUNT(*) FILTER (WHERE estado = 'cumplida') AS cumplidas,
      COUNT(*) FILTER (WHERE estado = 'cancelada') AS canceladas,
      COUNT(*) FILTER (WHERE estado = 'no_show') AS no_shows FROM reservas`),
    executor.query('SELECT estado, COUNT(*) AS cantidad FROM reservas GROUP BY estado ORDER BY estado'),
    executor.query(`SELECT m.numero, m.ubicacion, COUNT(r.id) AS cantidad_reservas
      FROM mesas m LEFT JOIN reservas r ON r.mesa_id = m.id
      GROUP BY m.id, m.numero, m.ubicacion
      ORDER BY cantidad_reservas DESC, m.numero ASC LIMIT 5`),
    executor.query(`SELECT nombre, telefono, no_shows FROM clientes
      WHERE no_shows > 0 ORDER BY no_shows DESC, nombre ASC`),
    executor.query(`SELECT hora_inicio::text AS franja_horaria,
      COUNT(*) AS reservas_en_franja,
      COUNT(*) FILTER (WHERE estado IN ('pendiente', 'confirmada')) AS reservas_activas,
      COALESCE(SUM(personas) FILTER (WHERE estado IN ('pendiente', 'confirmada')), 0) AS personas_esperadas,
      COUNT(DISTINCT mesa_id) FILTER (WHERE estado IN ('pendiente', 'confirmada')) AS mesas_ocupadas
      FROM reservas WHERE fecha = CURRENT_DATE GROUP BY hora_inicio ORDER BY hora_inicio ASC`)
  ]);

  return { totales: totales.rows[0], reservas_por_estado: porEstado.rows,
    mesas_mas_reservadas: mesasPopulares.rows, clientes_con_no_shows: clientesNoShow.rows,
    ocupacion_por_franja: ocupacionPorFranja.rows };
}
