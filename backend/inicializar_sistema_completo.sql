-- Script completo de inicialización para sistema_incidentes_nuevo
USE sistema_incidentes_nuevo;

-- 1. Limpiar datos existentes si los hay
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM Personal WHERE email = 'admin@seguridad.com';
DELETE FROM Ciudadano WHERE email = 'admin@seguridad.com';
DELETE FROM TipoIncidencia;
DELETE FROM Cargo;
DELETE FROM Rol;
SET FOREIGN_KEY_CHECKS = 1;

-- 2. Insertar Cargos
INSERT INTO Cargo (cod_cargo, denominacion, estado, orden) VALUES 
(1, 'Administrador', TRUE, '001'),
(2, 'Supervisor', TRUE, '002'),
(3, 'Operador', TRUE, '003'),
(4, 'Técnico', TRUE, '004');

-- 3. Insertar Roles
INSERT INTO Rol (cod_rol, denominacion, estado, orden) VALUES 
(1, 'admin', TRUE, '001'),
(2, 'supervisor', TRUE, '002'),
(3, 'operador', TRUE, '003'),
(4, 'ciudadano', TRUE, '004');

-- 4. Insertar tipos de incidencia básicos
INSERT INTO TipoIncidencia (denominacion, descripcion) VALUES 
('Robo', 'Robo de pertenencias'),
('Asalto', 'Asalto a personas'),
('Accidente', 'Accidente de tránsito'),
('Violencia', 'Actos de violencia'),
('Vandalismo', 'Daños a propiedad pública o privada'),
('Drogas', 'Tráfico o consumo de drogas'),
('Ruido', 'Contaminación sonora'),
('Otro', 'Otras incidencias');

-- 5. Insertar tipos de falta básicos
INSERT INTO TipoFalta (denominacion, descripcion) VALUES 
('Leve', 'Falta menor'),
('Grave', 'Falta considerable'),
('Muy Grave', 'Falta severa');

-- 6. Insertar tipos de delito básicos
INSERT INTO TipoDelito (denominacion, descripcion) VALUES 
('Contra la vida', 'Delitos contra la vida e integridad'),
('Contra el patrimonio', 'Robos, hurtos, estafas'),
('Contra la libertad', 'Secuestro, extorsión'),
('Contra la seguridad pública', 'Tráfico de drogas, armas');

-- 7. Crear ciudadano administrador
INSERT INTO Ciudadano (dni, nombres, apellidos, email, num_telefono1, firebase_uid, estado) VALUES 
('12345678', 'Admin', 'Sistema', 'admin@seguridad.com', '999999999', 'admin_uid_001', TRUE);

-- 8. Crear personal administrador (contraseña: admin123)
INSERT INTO Personal (dni, clave, nombres, apellidos, email, telefono, cod_cargo, cod_rol, firebase_uid, estado) VALUES 
('12345678', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewdBdXBvEszVeMFa', 'Admin', 'Sistema', 'admin@seguridad.com', '999999999', 1, 1, 'admin_uid_002', TRUE);

-- 9. Verificar los datos insertados
SELECT 'Verificación de datos insertados' as STATUS;
SELECT COUNT(*) as total_cargos FROM Cargo;
SELECT COUNT(*) as total_roles FROM Rol;
SELECT COUNT(*) as total_tipos_incidencia FROM TipoIncidencia;
SELECT COUNT(*) as total_ciudadanos FROM Ciudadano;
SELECT COUNT(*) as total_personal FROM Personal;

-- 10. Mostrar algunos datos para verificar
SELECT 'Ciudadanos registrados:' as INFO;
SELECT dni, nombres, apellidos, email FROM Ciudadano;

SELECT 'Personal registrado:' as INFO;
SELECT codigo, dni, nombres, apellidos, email, telefono FROM Personal;

SELECT 'Tipos de incidencia:' as INFO;
SELECT cod_tipoincidencia, denominacion FROM TipoIncidencia;

SELECT 'Finalizado correctamente' as STATUS;