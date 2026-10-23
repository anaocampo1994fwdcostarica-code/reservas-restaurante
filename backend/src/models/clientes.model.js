import pool from '../db.js';

export async function listar(executor = pool) {
  const resultado = await executor.query(
    'SELECT id, nombre, telefono, no_shows FROM clientes ORDER BY nombre ASC'
  );
  return resultado.rows;
}

export async function buscarPorId(id, executor = pool) {
  const resultado = await executor.query(
    'SELECT id, nombre, telefono, no_shows FROM clientes WHERE id = $1',
    [id]
  );
  return resultado.rows[0];
}

export async function crear({ nombre, telefono }, executor = pool) {
  const resultado = await executor.query(
    `INSERT INTO clientes (nombre, telefono)
     VALUES ($1, $2)
     RETURNING id, nombre, telefono, no_shows`,
    [nombre, telefono]
  );
  return resultado.rows[0];
}

export async function actualizar(id, { nombre, telefono }, executor = pool) {
  const resultado = await executor.query(
    `UPDATE clientes
     SET nombre = $1, telefono = $2
     WHERE id = $3
     RETURNING id, nombre, telefono, no_shows`,
    [nombre, telefono, id]
  );
  return resultado.rows[0];
}

export async function eliminar(id, executor = pool) {
  const resultado = await executor.query(
    'DELETE FROM clientes WHERE id = $1 RETURNING id',
    [id]
  );
  return resultado.rows[0];
}

export async function incrementarNoShows(id, executor = pool) {
  const resultado = await executor.query(
    `UPDATE clientes
     SET no_shows = no_shows + 1
     WHERE id = $1
     RETURNING id, no_shows`,
    [id]
  );
  return resultado.rows[0];
}
