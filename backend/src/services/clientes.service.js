import pool from '../db.js';

export async function listarClientes() {
  const resultado = await pool.query(
    'SELECT id, nombre, telefono, no_shows FROM clientes ORDER BY nombre ASC'
  );

  return resultado.rows;
}

export async function buscarClientePorId(id) {
  const resultado = await pool.query(
    'SELECT id, nombre, telefono, no_shows FROM clientes WHERE id = $1',
    [id]
  );

  return resultado.rows[0];
}

export async function crearCliente(nombre, telefono) {
  const resultado = await pool.query(
    `INSERT INTO clientes (nombre, telefono)
     VALUES ($1, $2)
     RETURNING id, nombre, telefono, no_shows`,
    [nombre, telefono]
  );

  return resultado.rows[0];
}

export async function actualizarCliente(id, nombre, telefono) {
  const resultado = await pool.query(
    `UPDATE clientes
     SET nombre = $1, telefono = $2
     WHERE id = $3
     RETURNING id, nombre, telefono, no_shows`,
    [nombre, telefono, id]
  );

  return resultado.rows[0];
}

export async function eliminarCliente(id) {
  const resultado = await pool.query(
    'DELETE FROM clientes WHERE id = $1 RETURNING id',
    [id]
  );

  return resultado.rows[0];
}
