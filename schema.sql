DROP TABLE IF EXISTS reservas;
DROP TABLE IF EXISTS horarios;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS mesas;

CREATE TABLE mesas (
  id SERIAL PRIMARY KEY,
  numero INTEGER NOT NULL UNIQUE CHECK (numero > 0),
  capacidad INTEGER NOT NULL CHECK (capacidad > 0),
  ubicacion VARCHAR(50) NOT NULL,
  activa BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) NOT NULL UNIQUE,
  no_shows INTEGER NOT NULL DEFAULT 0 CHECK (no_shows >= 0)
);

CREATE TABLE horarios (
  id SERIAL PRIMARY KEY,
  dia_semana INTEGER NOT NULL UNIQUE CHECK (dia_semana BETWEEN 0 AND 6),
  apertura TIME NOT NULL,
  cierre TIME NOT NULL,
  CHECK (cierre > apertura)
);

CREATE TABLE reservas (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
  mesa_id INTEGER NOT NULL REFERENCES mesas(id) ON DELETE RESTRICT,
  fecha DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  personas INTEGER NOT NULL CHECK (personas > 0),
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente'
    CHECK (estado IN ('pendiente', 'confirmada', 'cumplida', 'cancelada', 'no_show')),
  nota TEXT,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (hora_fin > hora_inicio)
);

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
(0, '11:00', '21:00'),
(1, '11:00', '21:00'),
(2, '11:00', '21:00'),
(3, '11:00', '21:00'),
(4, '11:00', '22:00'),
(5, '11:00', '22:00'),
(6, '11:00', '20:00');

INSERT INTO reservas (
  cliente_id, mesa_id, fecha, hora_inicio, hora_fin, personas, estado, nota
) VALUES
(1, 2, CURRENT_DATE + 1, '18:00', '20:00', 4, 'confirmada', 'Cumpleaños familiar'),
(2, 3, CURRENT_DATE + 1, '19:00', '21:00', 2, 'pendiente', 'Mesa en terraza');
