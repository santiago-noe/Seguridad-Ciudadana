-- VERIFICAR DÓNDE ESTÁN LOS DATOS ACTUALMENTE
USE seguridad_ciudadana;

-- Mostrar todas las tablas que existen
SHOW TABLES;

-- Ver usuarios registrados (si existe la tabla)
SELECT 'USUARIOS:' as info;
SELECT COUNT(*) as total FROM usuarios;
SELECT * FROM usuarios ORDER BY fecha_registro DESC LIMIT 5;

-- Ver incidentes registrados (si existe la tabla)  
SELECT 'INCIDENTES:' as info;
SELECT COUNT(*) as total FROM incidentes;
SELECT * FROM incidentes ORDER BY fecha_creacion DESC LIMIT 5;

-- Verificar otras posibles tablas
SELECT 'VERIFICANDO OTRAS TABLAS:' as info;
SELECT 
    CASE 
        WHEN EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'ciudadano' AND table_schema = 'seguridad_ciudadana') 
        THEN 'EXISTE tabla ciudadano'
        ELSE 'NO existe tabla ciudadano'
    END as ciudadano_status,
    CASE 
        WHEN EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'personal' AND table_schema = 'seguridad_ciudadana') 
        THEN 'EXISTE tabla personal'
        ELSE 'NO existe tabla personal'
    END as personal_status,
    CASE 
        WHEN EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'incidencia' AND table_schema = 'seguridad_ciudadana') 
        THEN 'EXISTE tabla incidencia'
        ELSE 'NO existe tabla incidencia'
    END as incidencia_status;