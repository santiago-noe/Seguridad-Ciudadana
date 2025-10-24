-- Inicialización de datos básicos para sistema_incidentes_nuevo
USE sistema_incidentes_nuevo;

-- Crear cargos básicos si no existen
INSERT IGNORE INTO Cargo (cod_cargo, denominacion, estado, orden) VALUES 
(1, 'Administrador', TRUE, '001'),
(2, 'Supervisor', TRUE, '002'),
(3, 'Operador', TRUE, '003');

-- Crear roles básicos si no existen  
INSERT IGNORE INTO Rol (cod_rol, denominacion, estado, orden) VALUES
(1, 'Super Admin', TRUE, '001'),
(2, 'Admin', TRUE, '002'),
(3, 'Usuario', TRUE, '003');

-- Crear tipos de incidencia básicos si no existen
INSERT IGNORE INTO TipoIncidencia (cod_tipoincidencia, denominacion, descripcion, estado) VALUES
(1, 'Robo', 'Incidentes de robo y hurto', TRUE),
(2, 'Accidente', 'Accidentes de tránsito y otros', TRUE),
(3, 'Violencia', 'Incidentes de violencia', TRUE),
(4, 'Drogas', 'Incidentes relacionados con drogas', TRUE),
(5, 'Vandalismo', 'Actos de vandalismo', TRUE),
(6, 'Otros', 'Otros tipos de incidentes', TRUE);

SELECT 'Datos básicos inicializados correctamente ✅' as resultado;