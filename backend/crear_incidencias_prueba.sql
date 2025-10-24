-- Script para verificar datos en las tablas y crear incidencias de prueba
USE sistema_incidentes_nuevo;

-- 1. Verificar que tenemos tipos de falta y delito
SELECT 'TipoFalta' as tabla, COUNT(*) as total FROM TipoFalta WHERE estado = TRUE;
SELECT 'TipoDelito' as tabla, COUNT(*) as total FROM TipoDelito WHERE estado = TRUE;
SELECT 'Ciudadano' as tabla, COUNT(*) as total FROM Ciudadano WHERE estado = TRUE;

-- 2. Ver algunos tipos disponibles
SELECT 'TIPOS DE FALTA:' as info;
SELECT cod_tipofalta, denominacion FROM TipoFalta WHERE estado = TRUE LIMIT 5;

SELECT 'TIPOS DE DELITO:' as info;
SELECT cod_tipodelito, denominacion FROM TipoDelito WHERE estado = TRUE LIMIT 5;

-- 3. Ver ciudadanos disponibles
SELECT 'CIUDADANOS:' as info;
SELECT dni, nombres, apellidos FROM Ciudadano WHERE estado = TRUE LIMIT 5;

-- 4. Crear incidencias de prueba (ajusta el DNI por uno que exista)
-- Reemplaza '12345678' por el DNI de Noe Yupanqui Santiago o el ciudadano que tengas

-- Incidencia tipo FALTA
INSERT INTO Incidencia (descripcion, direccion, dni, latitud, longitud, cod_tipofalta, estado, fecha, hora)
VALUES (
    'Ruidos molestos provenientes de una fiesta en horario nocturno',
    'Av. Los Héroes 123, Ayacucho',
    '12345678', -- Cambia por DNI real
    -13.1588,
    -74.2239,
    (SELECT cod_tipofalta FROM TipoFalta WHERE denominacion = 'Ruidos Molestos' LIMIT 1),
    'pendiente',
    CURDATE(),
    CURTIME()
);

-- Incidencia tipo DELITO  
INSERT INTO Incidencia (descripcion, direccion, dni, latitud, longitud, cod_tipodelito, estado, fecha, hora)
VALUES (
    'Sustracción de celular en transporte público',
    'Jr. 28 de Julio esquina con Av. Independencia',
    '12345678', -- Cambia por DNI real
    -13.1608,
    -74.2250,
    (SELECT cod_tipodelito FROM TipoDelito WHERE denominacion = 'Hurto' LIMIT 1),
    'pendiente',
    CURDATE(),
    CURTIME()
);

-- 5. Verificar las incidencias creadas
SELECT 'INCIDENCIAS CREADAS:' as info;
SELECT 
    i.codigo_incidente,
    i.descripcion,
    i.direccion,
    i.fecha,
    i.hora,
    i.estado,
    CASE 
        WHEN i.cod_tipofalta IS NOT NULL THEN 'Falta'
        WHEN i.cod_tipodelito IS NOT NULL THEN 'Delito'
        ELSE 'Sin clasificar'
    END as categoria,
    COALESCE(tf.denominacion, td.denominacion) as tipo,
    CONCAT(c.nombres, ' ', c.apellidos) as ciudadano
FROM Incidencia i
LEFT JOIN TipoFalta tf ON i.cod_tipofalta = tf.cod_tipofalta
LEFT JOIN TipoDelito td ON i.cod_tipodelito = td.cod_tipodelito
LEFT JOIN Ciudadano c ON i.dni = c.dni
ORDER BY i.fecha_creacion DESC;