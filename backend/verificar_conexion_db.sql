-- Script para verificar la base de datos y tablas

-- 1. Verificar que la base de datos existe
SHOW DATABASES LIKE 'sistema_incidentes_nuevo';

-- 2. Usar la base de datos
USE sistema_incidentes_nuevo;

-- 3. Verificar que las tablas existen
SHOW TABLES;

-- 4. Verificar estructura de la tabla Ciudadano
DESCRIBE Ciudadano;

-- 5. Verificar si hay datos en las tablas
SELECT COUNT(*) as total_ciudadanos FROM Ciudadano;
SELECT COUNT(*) as total_tipos_incidencia FROM TipoIncidencia;
SELECT COUNT(*) as total_cargos FROM Cargo;
SELECT COUNT(*) as total_roles FROM Rol;

-- 6. Ver algunos registros
SELECT * FROM Ciudadano LIMIT 5;
SELECT * FROM TipoIncidencia LIMIT 5;