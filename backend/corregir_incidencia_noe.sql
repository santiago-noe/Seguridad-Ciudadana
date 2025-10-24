-- Script para corregir la incidencia específica de Noe Yupanqui
USE sistema_incidentes_nuevo;

-- 1. Encontrar la incidencia de Noe con descripción "prueba de descripcion"
SELECT 'INCIDENCIA A CORREGIR:' as info;
SELECT 
    i.codigo_incidente,
    i.descripcion,
    i.direccion,
    i.fecha,
    i.hora,
    i.cod_tipofalta,
    i.cod_tipodelito,
    CONCAT(c.nombres, ' ', c.apellidos) as ciudadano
FROM Incidencia i
LEFT JOIN Ciudadano c ON i.dni = c.dni
WHERE i.descripcion LIKE '%prueba de descripcion%'
   OR c.nombres LIKE '%Noe%'
ORDER BY i.codigo_incidente DESC
LIMIT 5;

-- 2. Ver tipos de falta disponibles
SELECT 'TIPOS DE FALTA DISPONIBLES:' as info;
SELECT cod_tipofalta, denominacion, descripcion 
FROM TipoFalta 
WHERE estado = TRUE 
ORDER BY denominacion;

-- 3. Asignar tipo "Alteración del Orden" a la incidencia de prueba
-- (Cambia el WHERE por el codigo_incidente específico si sabes cuál es)
UPDATE Incidencia 
SET cod_tipofalta = (
    SELECT cod_tipofalta 
    FROM TipoFalta 
    WHERE denominacion = 'Alteración del Orden' 
    LIMIT 1
)
WHERE descripcion = 'prueba de descripcion'
   OR descripcion LIKE '%prueba%';

-- 4. Si no existe "Alteración del Orden", usar el primer tipo disponible
UPDATE Incidencia 
SET cod_tipofalta = (
    SELECT cod_tipofalta 
    FROM TipoFalta 
    WHERE estado = TRUE 
    ORDER BY cod_tipofalta 
    LIMIT 1
)
WHERE (cod_tipofalta IS NULL AND cod_tipodelito IS NULL)
   AND (descripcion = 'prueba de descripcion' OR descripcion LIKE '%prueba%');

-- 5. Verificar que la incidencia ya tiene tipo asignado
SELECT 'DESPUÉS DE LA CORRECCIÓN:' as info;
SELECT 
    i.codigo_incidente,
    i.descripcion,
    i.fecha,
    i.hora,
    CASE 
        WHEN i.cod_tipofalta IS NOT NULL THEN 'Falta'
        WHEN i.cod_tipodelito IS NOT NULL THEN 'Delito'
        ELSE 'TODAVÍA SIN CLASIFICAR'
    END as categoria,
    COALESCE(tf.denominacion, td.denominacion, 'SIN TIPO') as tipo,
    CONCAT(c.nombres, ' ', c.apellidos) as ciudadano
FROM Incidencia i
LEFT JOIN TipoFalta tf ON i.cod_tipofalta = tf.cod_tipofalta
LEFT JOIN TipoDelito td ON i.cod_tipodelito = td.cod_tipodelito
LEFT JOIN Ciudadano c ON i.dni = c.dni
WHERE i.descripcion LIKE '%prueba%'
   OR c.nombres LIKE '%Noe%'
ORDER BY i.codigo_incidente DESC;