-- Script para inicializar datos en la nueva base de datos

-- Insertar tipos de incidencia básicos
INSERT INTO TipoIncidencia (denominacion, descripcion) VALUES 
('Robo', 'Robo de pertenencias'),
('Asalto', 'Asalto a personas'),
('Accidente', 'Accidente de tránsito'),
('Violencia', 'Actos de violencia'),
('Vandalismo', 'Daños a propiedad pública o privada'),
('Drogas', 'Tráfico o consumo de drogas'),
('Ruido', 'Contaminación sonora'),
('Otro', 'Otras incidencias');

-- Insertar tipos de falta básicos
INSERT INTO TipoFalta (denominacion, descripcion) VALUES 
('Leve', 'Falta menor'),
('Grave', 'Falta considerable'),
('Muy Grave', 'Falta severa');

-- Insertar tipos de delito básicos
INSERT INTO TipoDelito (denominacion, descripcion) VALUES 
('Contra la vida', 'Delitos contra la vida e integridad'),
('Contra el patrimonio', 'Robos, hurtos, estafas'),
('Contra la libertad', 'Secuestro, extorsión'),
('Contra la seguridad pública', 'Tráfico de drogas, armas');

-- Insertar cargos básicos
INSERT INTO Cargo (denominacion, orden) VALUES 
('Administrador', '1'),
('Supervisor', '2'),
('Operador', '3'),
('Técnico', '4');

-- Insertar roles básicos
INSERT INTO Rol (denominacion, orden) VALUES 
('admin', '1'),
('supervisor', '2'),
('operador', '3'),
('ciudadano', '4');

-- Insertar ciudadano administrador
INSERT INTO Ciudadano (dni, nombres, apellidos, email, num_telefono1, firebase_uid) VALUES 
('12345678', 'Admin', 'Sistema', 'admin@seguridad.com', '999999999', 'admin_uid_001');

-- Insertar personal administrador
INSERT INTO Personal (dni, clave, nombres, apellidos, email, telefono, cod_cargo, cod_rol, firebase_uid) VALUES 
('12345678', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewdBdXBvEszVeMFa', 'Admin', 'Sistema', 'admin@seguridad.com', '999999999', 1, 1, 'admin_uid_002');

-- El hash corresponde a la contraseña: admin123