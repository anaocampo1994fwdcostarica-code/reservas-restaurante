import pool from '../db.js';

function crearError(mensaje, status = 409) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

async function validarDatosReserva(
  clienteId,
  mesaId,
  fecha,
  horaInicio,
  horaFin,
  personas,
  reservaId = null
) {
  const cliente = await pool.query(
    'SELECT id, no_shows FROM clientes WHERE id = $1',
    [clienteId]
  );

  if (cliente.rowCount === 0) {
    throw crearError('Cliente no encontrado', 404);
  }

  if (cliente.rows[0].no_shows >= 3) {
    throw crearError('El cliente tiene 3 o más no-shows y no puede reservar');
  }

  const mesa = await pool.query(
    'SELECT id, capacidad, activa FROM mesas WHERE id = $1',
    [mesaId]
  );

  if (mesa.rowCount === 0) {
    throw crearError('Mesa no encontrada', 404);
  }

  if (!mesa.rows[0].activa) {
    throw crearError('La mesa seleccionada no está activa');
  }

  if (personas > mesa.rows[0].capacidad) {
    throw crearError('La cantidad de personas supera la capacidad de la mesa');
  }

  const diaSemana = new Date(`${fecha}T12:00:00`).getDay();

  const horario = await pool.query(
    'SELECT apertura, cierre FROM horarios WHERE dia_semana = $1',
    [diaSemana]
  );

  if (horario.rowCount === 0) {
    throw crearError('El restaurante no tiene horario de atención para ese día');
  }

  const { apertura, cierre } = horario.rows[0];

  if (horaInicio < apertura || horaFin > cierre) {
    throw crearError(
      `La reserva debe estar dentro del horario de atención: ${apertura} a ${cierre}`
    );
  }

  const valores = [mesaId, fecha, horaInicio, horaFin];

  let consultaCruce = `
    SELECT id
    FROM reservas
    WHERE mesa_id = $1
      AND fecha = $2
      AND estado IN ('pendiente', 'confirmada')
      AND hora_inicio < $4
      AND hora_fin > $3
  `;

  if (reservaId) {
    valores.push(reservaId);
    consultaCruce += ' AND id <> $5';
  }

  const cruce = await pool.query(consultaCruce, valores);

  if (cruce.rowCount > 0) {
    throw crearError('La mesa ya tiene una reserva activa que se cruza con ese horario');
  }
}

export async function listarReservas() {
  const resultado = await pool.query(`
    SELECT
      r.id,
      r.fecha,
      r.hora_inicio,
      r.hora_fin,
      r.personas,
      r.estado,
      r.nota,
      r.fecha_creacion,
      c.id AS cliente_id,
      c.nombre AS cliente_nombre,
      c.telefono AS cliente_telefono,
      m.id AS mesa_id,
      m.numero AS mesa_numero,
      m.ubicacion AS mesa_ubicacion
    FROM reservas r
    JOIN clientes c ON c.id = r.cliente_id
    JOIN mesas m ON m.id = r.mesa_id
    ORDER BY r.fecha ASC, r.hora_inicio ASC
  `);

  return resultado.rows;
}

export async function buscarReservaPorId(id) {
  const resultado = await pool.query(
    `
    SELECT
      r.id,
      r.fecha,
      r.hora_inicio,
      r.hora_fin,
      r.personas,
      r.estado,
      r.nota,
      r.fecha_creacion,
      c.id AS cliente_id,
      c.nombre AS cliente_nombre,
      c.telefono AS cliente_telefono,
      c.no_shows AS cliente_no_shows,
      m.id AS mesa_id,
      m.numero AS mesa_numero,
      m.capacidad AS mesa_capacidad,
      m.ubicacion AS mesa_ubicacion
    FROM reservas r
    JOIN clientes c ON c.id = r.cliente_id
    JOIN mesas m ON m.id = r.mesa_id
    WHERE r.id = $1
    `,
    [id]
  );

  return resultado.rows[0];
}

export async function crearReserva(datos) {
  await validarDatosReserva(
    datos.clienteId,
    datos.mesaId,
    datos.fecha,
    datos.horaInicio,
    datos.horaFin,
    datos.personas
  );

  const resultado = await pool.query(
    `
    INSERT INTO reservas (
      cliente_id, mesa_id, fecha, hora_inicio, hora_fin, personas, nota
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `,
    [
      datos.clienteId,
      datos.mesaId,
      datos.fecha,
      datos.horaInicio,
      datos.horaFin,
      datos.personas,
      datos.nota || null,
    ]
  );

  return resultado.rows[0];
}

export async function actualizarReserva(id, datos) {
  const existente = await buscarReservaPorId(id);

  if (!existente) {
    throw crearError('Reserva no encontrada', 404);
  }

  if (existente.estado !== 'pendiente') {
    throw crearError('Solo se pueden editar reservas en estado pendiente');
  }

  await validarDatosReserva(
    datos.clienteId,
    datos.mesaId,
    datos.fecha,
    datos.horaInicio,
    datos.horaFin,
    datos.personas,
    id
  );

  const resultado = await pool.query(
    `
    UPDATE reservas
    SET cliente_id = $1,
        mesa_id = $2,
        fecha = $3,
        hora_inicio = $4,
        hora_fin = $5,
        personas = $6,
        nota = $7
    WHERE id = $8
    RETURNING *
    `,
    [
      datos.clienteId,
      datos.mesaId,
      datos.fecha,
      datos.horaInicio,
      datos.horaFin,
      datos.personas,
      datos.nota || null,
      id,
    ]
  );

  return resultado.rows[0];
}

export async function cambiarEstado(id, nuevoEstado) {
  const cliente = await pool.connect();

  try {
    await cliente.query('BEGIN');

    const reserva = await cliente.query(
      'SELECT * FROM reservas WHERE id = $1 FOR UPDATE',
      [id]
    );

    if (reserva.rowCount === 0) {
      throw crearError('Reserva no encontrada', 404);
    }

    const actual = reserva.rows[0].estado;

    const transicionesPermitidas = {
      pendiente: ['confirmada', 'cancelada'],
      confirmada: ['cumplida', 'cancelada', 'no_show'],
      cumplida: [],
      cancelada: [],
      no_show: [],
    };

    if (!transicionesPermitidas[actual].includes(nuevoEstado)) {
      throw crearError(
        `No se permite cambiar el estado de "${actual}" a "${nuevoEstado}"`
      );
    }

    const resultado = await cliente.query(
      'UPDATE reservas SET estado = $1 WHERE id = $2 RETURNING *',
      [nuevoEstado, id]
    );

    if (nuevoEstado === 'no_show') {
      await cliente.query(
        'UPDATE clientes SET no_shows = no_shows + 1 WHERE id = $1',
        [reserva.rows[0].cliente_id]
      );
    }

    await cliente.query('COMMIT');
    return resultado.rows[0];
  } catch (error) {
    await cliente.query('ROLLBACK');
    throw error;
  } finally {
    cliente.release();
  }
}

export async function eliminarReserva(id) {
  const resultado = await pool.query(
    'DELETE FROM reservas WHERE id = $1 RETURNING id',
    [id]
  );

  return resultado.rows[0];
}
