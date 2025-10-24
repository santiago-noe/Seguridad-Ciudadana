-- Verificar en qué base de datos están las tablas nuevas
SHOW DATABASES;

-- Verificar tablas en seguridad_ciudadana
USE seguridad_ciudadana;
SHOW TABLES;
SELECT 'Tablas en seguridad_ciudadana:' as info;

-- Verificar si existe sistema_incidentes_nuevo
USE sistema_incidentes_nuevo;
SHOW TABLES;
SELECT 'Tablas en sistema_incidentes_nuevo:' as info;

-- Verificar si existe sistema_incidentes
USE sistema_incidentes;
SHOW TABLES;
SELECT 'Tablas en sistema_incidentes:' as info;