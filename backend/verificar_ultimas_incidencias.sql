-- Script para verificar las últimas incidencias registradas
USE sistema_incidentes_nuevo;

-- 1. Ver las últimas 3 incidencias registradas
SELECT 'ÚLTIMAS INCIDENCIAS:' as info;
SELECT 
    i.codigo_incidente,
    i.descripcion,
    i.direccion,
    i.dni,
    i.cod_tipofalta,
    i.cod_tipodelito,
    i.fecha,
    i.hora,
    i.fecha_creacion,
    CASE 
        WHEN i.cod_tipofalta IS NOT NULL THEN 'Falta'
        WHEN i.cod_tipodelito IS NOT NULL THEN 'Delito'
        ELSE 'SIN CLASIFICAR ❌'
    END as categoria_actual,
    tf.denominacion as nombre_falta,
    td.denominacion as nombre_delito,
    CONCAT(c.nombres, ' ', c.apellidos) as ciudadano
FROM Incidencia i
LEFT JOIN TipoFalta tf ON i.cod_tipofalta = tf.cod_tipofalta
LEFT JOIN TipoDelito td ON i.cod_tipodelito = td.cod_tipodelito
LEFT JOIN Ciudadano c ON i.dni = c.dni
WHERE c.nombres LIKE '%Noe%' OR i.descripcion LIKE '%prueba%'
ORDER BY i.codigo_incidente DESC
LIMIT 3;

-- 2. Ver todos los tipos de falta disponibles
SELECT 'TIPOS DE FALTA DISPONIBLES:' as info;
SELECT cod_tipofalta, denominacion, descripcion, estado
FROM TipoFalta 
WHERE estado = TRUE
ORDER BY cod_tipofalta;

-- 3. Verificar si hay incidencias con cod_tipofalta NULL
SELECT 'INCIDENCIAS SIN TIPO DE FALTA:' as info;
SELECT COUNT(*) as cantidad_sin_falta
FROM Incidencia 
WHERE cod_tipofalta IS NULL AND cod_tipodelito IS NULL;

-- 4. Corregir la última incidencia de Noe si no tiene tipo
-- Solo si la descripción contiene "prueba" y no tiene tipo asignado
UPDATE Incidencia 
SET cod_tipofalta = (
    SELECT cod_tipofalta 
    FROM TipoFalta 
    WHERE denominacion = 'Alteración del Orden' 
       OR denominacion = 'Ruidos Molestos'
       OR denominacion LIKE '%Alteración%'
    ORDER BY cod_tipofalta
    LIMIT 1
)
WHERE descripcion LIKE '%prueba%' 
  AND cod_tipofalta IS NULL 
  AND cod_tipodelito IS NULL;

-- 5. Verificar el resultado final
SELECT 'DESPUÉS DE LA CORRECCIÓN:' as info;
SELECT 
    i.codigo_incidente,
    i.descripcion,
    CASE 
        WHEN i.cod_tipofalta IS NOT NULL THEN CONCAT('Falta: ', tf.denominacion)
        WHEN i.cod_tipodelito IS NOT NULL THEN CONCAT('Delito: ', td.denominacion)
        ELSE 'TODAVÍA SIN CLASIFICAR ❌'
    END as clasificacion_final,
    i.fecha,
    i.hora
FROM Incidencia i
LEFT JOIN TipoFalta tf ON i.cod_tipofalta = tf.cod_tipofalta
LEFT JOIN TipoDelito td ON i.cod_tipodelito = td.cod_tipodelito
LEFT JOIN Ciudadano c ON i.dni = c.dni
WHERE c.nombres LIKE '%Noe%' OR i.descripcion LIKE '%prueba%'
ORDER BY i.codigo_incidente DESC;