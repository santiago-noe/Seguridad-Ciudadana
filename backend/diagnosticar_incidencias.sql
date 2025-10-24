-- Script para diagnosticar y corregir incidencias sin clasificar
USE sistema_incidentes_nuevo;

-- 1. Verificar todas las incidencias y sus tipos
SELECT 'DIAGNÓSTICO DE INCIDENCIAS:' as info;
SELECT 
    i.codigo_incidente,
    i.descripcion,
    i.direccion,
    i.fecha,
    i.hora,
    i.fecha_creacion,
    i.estado,
    i.cod_tipofalta,
    i.cod_tipodelito,
    CASE 
        WHEN i.cod_tipofalta IS NOT NULL THEN 'Falta'
        WHEN i.cod_tipodelito IS NOT NULL THEN 'Delito'
        ELSE 'SIN CLASIFICAR ❌'
    END as categoria,
    tf.denominacion as nombre_falta,
    td.denominacion as nombre_delito,
    CONCAT(c.nombres, ' ', c.apellidos) as ciudadano
FROM Incidencia i
LEFT JOIN TipoFalta tf ON i.cod_tipofalta = tf.cod_tipofalta
LEFT JOIN TipoDelito td ON i.cod_tipodelito = td.cod_tipodelito
LEFT JOIN Ciudadano c ON i.dni = c.dni
ORDER BY i.codigo_incidente DESC;

-- 2. Contar incidencias sin clasificar
SELECT 'ESTADÍSTICAS:' as info;
SELECT 
    'Total Incidencias' as tipo,
    COUNT(*) as cantidad
FROM Incidencia
UNION ALL
SELECT 
    'Sin Clasificar' as tipo,
    COUNT(*) as cantidad
FROM Incidencia 
WHERE cod_tipofalta IS NULL AND cod_tipodelito IS NULL
UNION ALL
SELECT 
    'Con Falta' as tipo,
    COUNT(*) as cantidad
FROM Incidencia 
WHERE cod_tipofalta IS NOT NULL
UNION ALL
SELECT 
    'Con Delito' as tipo,
    COUNT(*) as cantidad
FROM Incidencia 
WHERE cod_tipodelito IS NOT NULL;

-- 3. Ver tipos disponibles para asignar
SELECT 'TIPOS DISPONIBLES PARA ASIGNAR:' as info;
SELECT 'FALTAS:' as categoria, cod_tipofalta as codigo, denominacion as nombre FROM TipoFalta WHERE estado = TRUE
UNION ALL
SELECT 'DELITOS:' as categoria, cod_tipodelito as codigo, denominacion as nombre FROM TipoDelito WHERE estado = TRUE;

-- 4. CORREGIR incidencias sin clasificar - asignar un tipo por defecto
-- Actualizar incidencias sin clasificar para que tengan un tipo de falta "Otros"
UPDATE Incidencia 
SET cod_tipofalta = (SELECT cod_tipofalta FROM TipoFalta WHERE denominacion LIKE '%Otros%' OR denominacion LIKE '%Alteración%' LIMIT 1)
WHERE cod_tipofalta IS NULL 
AND cod_tipodelito IS NULL;

-- 5. Si no hay una falta "Otros", crear una
INSERT IGNORE INTO TipoFalta (denominacion, descripcion, estado) 
VALUES ('Otros', 'Otras situaciones no clasificadas', TRUE);

-- 6. Asignar la falta "Otros" a incidencias sin clasificar
UPDATE Incidencia 
SET cod_tipofalta = (SELECT cod_tipofalta FROM TipoFalta WHERE denominacion = 'Otros' LIMIT 1)
WHERE cod_tipofalta IS NULL 
AND cod_tipodelito IS NULL;

-- 7. Verificar que ya no hay incidencias sin clasificar
SELECT 'DESPUÉS DE LA CORRECCIÓN:' as info;
SELECT 
    i.codigo_incidente,
    i.descripcion,
    CASE 
        WHEN i.cod_tipofalta IS NOT NULL THEN 'Falta'
        WHEN i.cod_tipodelito IS NOT NULL THEN 'Delito'
        ELSE 'TODAVÍA SIN CLASIFICAR ❌'
    END as categoria,
    COALESCE(tf.denominacion, td.denominacion, 'SIN TIPO') as tipo,
    i.fecha,
    i.hora
FROM Incidencia i
LEFT JOIN TipoFalta tf ON i.cod_tipofalta = tf.cod_tipofalta
LEFT JOIN TipoDelito td ON i.cod_tipodelito = td.cod_tipodelito
ORDER BY i.codigo_incidente DESC;