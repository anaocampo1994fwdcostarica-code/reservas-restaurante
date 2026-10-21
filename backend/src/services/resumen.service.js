import pool from '../db.js';

export async function obtenerResumen() {
  const [totales, porEstado, mesasPopulares, clientesNoShow] = await Promise.all([
    pool.query(`
      SELECT
        COUNT(*) AS total_reservas,
        COUNT(*) FILTER (WHERE estado = 'pendiente') AS pendientes,
        COUNT(*) FILTER (WHERE estado = 'confirmada') AS confirmadas,
        COUNT(*) FILTER (WHERE estado = 'cumplida') AS cumplidas,
        COUNT(*) FILTER (WHERE estado = 'cancelada') AS canceladas,
        COUNT(*) FILTER (WHERE estado = 'no_show') AS no_shows
      FROM reservas
    `),

    pool.query(`
      SELECT estado, COUNT(*) AS cantidad
      FROM reservas
      GROUP BY estado
      ORDER BY estado
    `),

    pool.query(`
      SELECT
        m.numero,
        m.ubicacion,
        COUNT(r.id) AS cantidad_reservas
      FROM mesas m
      LEFT JOIN reservas r ON r.mesa_id = m.id
      GROUP BY m.id, m.numero, m.ubicacion
      ORDER BY cantidad_reservas DESC, m.numero ASC
      LIMIT 5
    `),

    pool.query(`
      SELECT nombre, telefono, no_shows
      FROM clientes
      WHERE no_shows > 0
      ORDER BY no_shows DESC, nombre ASC
    `)
  ]);

  return {
    totales: totales.rows[0],
    reservas_por_estado: porEstado.rows,
    mesas_mas_reservadas: mesasPopulares.rows,
    clientes_con_no_shows: clientesNoShow.rows
  };
}
