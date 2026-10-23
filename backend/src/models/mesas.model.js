import pool from '../db.js';

export async function listar(executor = pool) {
  const resultado = await executor.query(
    `SELECT id, numero, capacidad, ubicacion, activa
     FROM mesas
     ORDER BY numero ASC`
  );
  return resultado.rows;
}

export async function buscarPorId(id, executor = pool) {
  const resultado = await executor.query(
    `SELECT id, numero, capacidad, ubicacion, activa
     FROM mesas
     WHERE id = $1`,
    [id]
  );
  return resultado.rows[0];
}
