-- Script de prueba simple para verificar registro de fecha
USE sistema_incidentes_nuevo;

-- 1. Verificar estructura de la tabla Incidencia
DESCRIBE Incidencia;

-- 2. Verificar que hay ciudadanos disponibles
SELECT 'CIUDADANOS DISPONIBLES:' as info;
SELECT dni, nombres, apellidos FROM Ciudadano WHERE estado = TRUE LIMIT 3;

-- 3. Verificar tipos disponibles
SELECT 'TIPOS DE FALTA:' as info;
SELECT cod_tipofalta, denominacion FROM TipoFalta WHERE estado = TRUE LIMIT 3;

-- 4. Insertar una incidencia de prueba con fecha actual
-- CAMBIA EL DNI POR UNO QUE EXISTA EN TU BASE DE DATOS
INSERT INTO Incidencia (
    descripcion, 
    direccion, 
    dni, 
    cod_tipofalta, 
    estado, 
    fecha, 
    hora
) VALUES (
    'Prueba de registro de incidencia con fecha actual',
    'Dirección de prueba, Ayacucho',
    '12345678', -- CAMBIA ESTE DNI POR UNO REAL
    1, -- Primer tipo de falta
    'pendiente',
    CURDATE(), -- Fecha actual
    CURTIME()  -- Hora actual
);

-- 5. Verificar la incidencia recién creada
SELECT 'ÚLTIMA INCIDENCIA CREADA:' as info;
SELECT 
    codigo_incidente,
    descripcion,
    direccion,
    fecha,
    hora,
    fecha_creacion,
    estado,
    dni
FROM Incidencia 
ORDER BY codigo_incidente DESC 
LIMIT 1;

-- 6. Ver el formato que devuelve el endpoint
SELECT 'FORMATO ENDPOINT:' as info;
SELECT 
    i.codigo_incidente as id,
    i.descripcion,
    i.direccion,
    i.fecha,
    i.hora,
    i.fecha_creacion,
    i.estado,
    CASE 
        WHEN i.cod_tipofalta IS NOT NULL THEN 'Falta'
        WHEN i.cod_tipodelito IS NOT NULL THEN 'Delito'
        ELSE 'Sin clasificar'
    END as categoria,
    COALESCE(tf.denominacion, td.denominacion) as tipo,
    CONCAT(c.nombres, ' ', c.apellidos) as nombre_ciudadano
FROM Incidencia i
LEFT JOIN TipoFalta tf ON i.cod_tipofalta = tf.cod_tipofalta
LEFT JOIN TipoDelito td ON i.cod_tipodelito = td.cod_tipodelito
LEFT JOIN Ciudadano c ON i.dni = c.dni
ORDER BY i.codigo_incidente DESC 
LIMIT 3;