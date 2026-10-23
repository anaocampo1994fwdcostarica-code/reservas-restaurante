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
