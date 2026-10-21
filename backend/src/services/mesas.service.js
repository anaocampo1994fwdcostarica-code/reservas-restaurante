import pool from '../db.js';

export async function listarMesas() {
  const resultado = await pool.query(
    `SELECT id, numero, capacidad, ubicacion, activa
     FROM mesas
     ORDER BY numero ASC`
  );

  return resultado.rows;
}

export async function buscarMesaPorId(id) {
  const resultado = await pool.query(
    `SELECT id, numero, capacidad, ubicacion, activa
     FROM mesas
     WHERE id = $1`,
    [id]
  );

  return resultado.rows[0];
}
