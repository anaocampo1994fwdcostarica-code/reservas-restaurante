INSERT INTO mesas (numero, capacidad, ubicacion, activa) VALUES
  (1, 2, 'Interior', TRUE),
  (2, 4, 'Interior', TRUE),
  (3, 4, 'Terraza', TRUE),
  (4, 6, 'Terraza', TRUE),
  (5, 8, 'Salón privado', TRUE);

INSERT INTO clientes (nombre, telefono, no_shows) VALUES
  ('Ana María Ocampo', '8888-1111', 0),
  ('Carlos Rodríguez', '8888-2222', 1),
  ('Sofía Hernández', '8888-3333', 0);

INSERT INTO horarios (dia_semana, apertura, cierre) VALUES
  (0, '11:00', '21:00'), (1, '11:00', '21:00'),
  (2, '11:00', '21:00'), (3, '11:00', '21:00'),
  (4, '11:00', '22:00'), (5, '11:00', '22:00'),
  (6, '11:00', '20:00');

INSERT INTO reservas (
  cliente_id, mesa_id, fecha, hora_inicio, hora_fin, personas, estado, nota
) VALUES
  (1, 2, CURRENT_DATE + 1, '18:00', '20:00', 4, 'confirmada', 'Cumpleaños familiar'),
  (2, 3, CURRENT_DATE + 1, '19:00', '21:00', 2, 'pendiente', 'Mesa en terraza');
