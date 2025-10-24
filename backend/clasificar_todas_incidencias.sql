-- Script general para clasificar TODAS las incidencias sin tipo
USE sistema_incidentes_nuevo;

-- 1. Ver todas las incidencias sin clasificar
SELECT 'INCIDENCIAS SIN CLASIFICAR:' as info;
SELECT 
    i.codigo_incidente,
    i.descripcion,
    i.direccion,
    i.fecha,
    CONCAT(c.nombres, ' ', c.apellidos) as ciudadano,
    'SIN CLASIFICAR' as estado_actual
FROM Incidencia i
LEFT JOIN Ciudadano c ON i.dni = c.dni
WHERE i.cod_tipofalta IS NULL AND i.cod_tipodelito IS NULL;

-- 2. Insertar tipo "General" si no existe
INSERT IGNORE INTO TipoFalta (denominacion, descripcion, estado) 
VALUES ('General', 'Incidencias generales no específicas', TRUE);

-- 3. Asignar tipo "General" a TODAS las incidencias sin clasificar
UPDATE Incidencia 
SET cod_tipofalta = (
    SELECT cod_tipofalta 
    FROM TipoFalta 
    WHERE denominacion = 'General' 
    LIMIT 1
)
WHERE cod_tipofalta IS NULL AND cod_tipodelito IS NULL;

-- 4. Verificar que YA NO hay incidencias sin clasificar
SELECT 'VERIFICACIÓN FINAL:' as info;
SELECT 
    'Incidencias sin clasificar' as tipo,
    COUNT(*) as cantidad
FROM Incidencia 
WHERE cod_tipofalta IS NULL AND cod_tipodelito IS NULL
UNION ALL
SELECT 
    'Incidencias clasificadas' as tipo,
    COUNT(*) as cantidad
FROM Incidencia 
WHERE cod_tipofalta IS NOT NULL OR cod_tipodelito IS NOT NULL;

-- 5. Ver todas las incidencias clasificadas
SELECT 'TODAS LAS INCIDENCIAS AHORA:' as info;
SELECT 
    i.codigo_incidente,
    i.descripcion,
    i.fecha,
    CASE 
        WHEN i.cod_tipofalta IS NOT NULL THEN 'Falta'
        WHEN i.cod_tipodelito IS NOT NULL THEN 'Delito'
        ELSE 'ERROR: AÚN SIN CLASIFICAR'
    END as categoria,
    COALESCE(tf.denominacion, td.denominacion, 'ERROR') as tipo,
    CONCAT(c.nombres, ' ', c.apellidos) as ciudadano
FROM Incidencia i
LEFT JOIN TipoFalta tf ON i.cod_tipofalta = tf.cod_tipofalta
LEFT JOIN TipoDelito td ON i.cod_tipodelito = td.cod_tipodelito
LEFT JOIN Ciudadano c ON i.dni = c.dni
ORDER BY i.codigo_incidente DESC;