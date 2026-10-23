import pool from '../db.js';

export async function buscarPorDiaSemana(diaSemana, executor = pool) {
  const resultado = await executor.query(
    'SELECT apertura, cierre FROM horarios WHERE dia_semana = $1',
    [diaSemana]
  );
  return resultado.rows[0];
}
