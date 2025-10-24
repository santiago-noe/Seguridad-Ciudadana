-- Script para configurar roles y cargos de ejemplo en sistema_incidentes_nuevo
USE sistema_incidentes_nuevo;

-- 1. Verificar datos actuales
SELECT 'Estado actual del sistema:' as INFO;
SELECT COUNT(*) as total_ciudadanos FROM Ciudadano;
SELECT COUNT(*) as total_personal FROM Personal;

-- 2. Limpiar datos de personal para reconfigurar
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM Personal WHERE email != 'admin@seguridad.com';
SET FOREIGN_KEY_CHECKS = 1;

-- 3. Asegurar que existen los cargos y roles básicos
INSERT IGNORE INTO Cargo (cod_cargo, denominacion, estado, orden) VALUES 
(1, 'Administrador', TRUE, '001'),
(2, 'Supervisor', TRUE, '002'),
(3, 'Operador', TRUE, '003'),
(4, 'Técnico', TRUE, '004');

INSERT IGNORE INTO Rol (cod_rol, denominacion, estado, orden) VALUES 
(1, 'admin', TRUE, '001'),
(2, 'supervisor', TRUE, '002'),
(3, 'operador', TRUE, '003'),
(4, 'ciudadano', TRUE, '004');

-- 4. Configurar el admin del sistema como Supervisor
UPDATE Personal 
SET cod_cargo = 2, cod_rol = 2  -- Supervisor con rol supervisor
WHERE email = 'admin@seguridad.com';

-- 5. Agregar tu usuario como Administrador Principal
INSERT IGNORE INTO Personal (dni, clave, nombres, apellidos, email, telefono, cod_cargo, cod_rol, firebase_uid, estado) 
VALUES ('71998776', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewdBdXBvEszVeMFa', 'Tim', 'Santiago Enciso', 'noe.yupanqui.27@unsch.edu.pe', '945187545', 1, 1, 'user_uid_003', TRUE);

-- 6. Agregar algunos usuarios de ejemplo
INSERT IGNORE INTO Ciudadano (dni, nombres, apellidos, email, num_telefono1, estado) VALUES 
('87654321', 'María', 'González Pérez', 'maria.gonzalez@email.com', '987654321', TRUE),
('11223344', 'Carlos', 'Rodríguez López', 'carlos.rodriguez@email.com', '912345678', TRUE),
('55667788', 'Ana', 'Martínez Silva', 'ana.martinez@email.com', '956789012', TRUE);

-- 7. Promover algunos ciudadanos a personal con diferentes roles
INSERT IGNORE INTO Personal (dni, clave, nombres, apellidos, email, telefono, cod_cargo, cod_rol, firebase_uid, estado) VALUES 
('87654321', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewdBdXBvEszVeMFa', 'María', 'González Pérez', 'maria.gonzalez@email.com', '987654321', 3, 3, 'maria_uid_004', TRUE),
('11223344', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewdBdXBvEszVeMFa', 'Carlos', 'Rodríguez López', 'carlos.rodriguez@email.com', '912345678', 4, 3, 'carlos_uid_005', TRUE);
-- María: Operador con rol operador
-- Carlos: Técnico con rol operador

-- 8. Verificar la configuración final
SELECT 'Configuración final:' as INFO;

SELECT 'Ciudadanos registrados:' as TIPO;
SELECT dni, nombres, apellidos, email, num_telefono1 FROM Ciudadano ORDER BY nombres;

SELECT 'Personal del sistema:' as TIPO;
SELECT p.dni, p.nombres, p.apellidos, p.email, p.telefono, c.denominacion as cargo, r.denominacion as rol
FROM Personal p
LEFT JOIN Cargo c ON p.cod_cargo = c.cod_cargo
LEFT JOIN Rol r ON p.cod_rol = r.cod_rol
ORDER BY p.cod_cargo, p.nombres;

SELECT 'Resumen por roles:' as TIPO;
SELECT r.denominacion as rol, COUNT(*) as cantidad
FROM Personal p
JOIN Rol r ON p.cod_rol = r.cod_rol
GROUP BY r.denominacion
ORDER BY p.cod_rol;

SELECT 'Resumen por cargos:' as TIPO;
SELECT c.denominacion as cargo, COUNT(*) as cantidad
FROM Personal p
JOIN Cargo c ON p.cod_cargo = c.cod_cargo
GROUP BY c.denominacion
ORDER BY p.cod_cargo;