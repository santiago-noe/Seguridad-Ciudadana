-- ===============================
-- LIMPIEZA DE BASES DE DATOS INNECESARIAS
-- Mantener solo: seguridad_ciudadana (base principal)
-- ===============================

-- Mostrar todas las bases de datos antes de limpiar
SELECT 'BASES DE DATOS ANTES DE LIMPIEZA:' as mensaje;
SHOW DATABASES;

-- Eliminar bases de datos innecesarias
SELECT 'Eliminando sistema_incidentes_nuevo...' as mensaje;
DROP DATABASE IF EXISTS sistema_incidentes_nuevo;

SELECT 'Eliminando sistema_incidentes...' as mensaje;
DROP DATABASE IF EXISTS sistema_incidentes;

-- Verificar que solo quede seguridad_ciudadana
SELECT 'BASES DE DATOS DESPUÉS DE LIMPIEZA:' as mensaje;
SHOW DATABASES;

-- Verificar que seguridad_ciudadana esté funcionando
USE seguridad_ciudadana;
SELECT 'VERIFICANDO BASE DE DATOS PRINCIPAL:' as mensaje;

-- Mostrar tablas existentes
SHOW TABLES;

-- Contar registros importantes
SELECT 
    'Datos en seguridad_ciudadana:' as info,
    (SELECT COUNT(*) FROM usuarios) as total_usuarios,
    (SELECT COUNT(*) FROM incidentes) as total_incidentes;

-- Verificar estructura de tabla usuarios
SELECT 'ESTRUCTURA TABLA USUARIOS:' as mensaje;
DESCRIBE usuarios;

-- Verificar estructura de tabla incidentes
SELECT 'ESTRUCTURA TABLA INCIDENTES:' as mensaje;
DESCRIBE incidentes;

SELECT '✅ LIMPIEZA COMPLETADA - Solo seguridad_ciudadana activa' as resultado;