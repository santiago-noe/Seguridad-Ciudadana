CREATE DATABASE IF NOT EXISTS seguridad_ciudadana;
USE seguridad_ciudadana;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  dni VARCHAR(20) UNIQUE,
  rol ENUM('admin', 'ciudadano') DEFAULT 'ciudadano',
  firebase_uid VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS incidentes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL,
  ubicacion VARCHAR(255) NOT NULL,
  descripcion TEXT,
  fecha DATE NOT NULL,
  lat DOUBLE,
  lng DOUBLE
);

-- Insertar usuario administrador por defecto
-- Email: admin@seguridad.com
-- Contraseña: admin123
INSERT IGNORE INTO usuarios (nombre, apellido, email, password, telefono, dni, rol, firebase_uid) 
VALUES ('Administrador', 'Sistema', 'admin@seguridad.com', '$2b$10$8K1p.c2r.HxY9YKz.123.O1VNGZnAhO8DQwCWwxLAhYy.Qj2eQF6i', '999999999', '12345678', 'admin', NULL);
