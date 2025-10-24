-- Verificar estructura exacta de las tablas en sistema_incidentes_nuevo
USE sistema_incidentes_nuevo;

-- Ver estructura de tabla Ciudadano
SELECT 'ESTRUCTURA TABLA CIUDADANO:' as info;
DESCRIBE Ciudadano;

-- Ver estructura de tabla Personal  
SELECT 'ESTRUCTURA TABLA PERSONAL:' as info;
DESCRIBE Personal;

-- Ver todas las tablas disponibles
SELECT 'TODAS LAS TABLAS:' as info;
SHOW TABLES;

-- Ver algunos datos de ejemplo si existen
SELECT 'DATOS EXISTENTES EN CIUDADANO:' as info;
SELECT * FROM Ciudadano LIMIT 3;

SELECT 'DATOS EXISTENTES EN PERSONAL:' as info;
SELECT * FROM Personal LIMIT 3;