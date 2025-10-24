-- ===============================
-- CONSULTAS PARA sistema_incidentes_nuevo
-- ===============================

USE sistema_incidentes_nuevo;

-- ✅ Ver todos los ciudadanos registrados
SELECT 'CIUDADANOS REGISTRADOS:' as info;
SELECT 
    dni,
    nombres,
    apellidos,
    email,
    num_telefono1,
    fecha_creacion,
    estado
FROM Ciudadano 
ORDER BY fecha_creacion DESC;

-- ✅ Ver todas las incidencias creadas  
SELECT 'INCIDENCIAS CREADAS:' as info;
SELECT 
    i.cod_incidencia,
    c.nombres,
    c.apellidos,
    c.email,
    ti.denominacion as tipo_incidencia,
    i.descripcion,
    i.ubicacion,
    i.fecha_incidencia,
    i.estado,
    i.fecha_registro
FROM Incidencia i
JOIN Ciudadano c ON i.dni_ciudadano = c.dni
JOIN TipoIncidencia ti ON i.cod_tipoincidencia = ti.cod_tipoincidencia
ORDER BY i.fecha_registro DESC;

-- ✅ Ver personal administrativo
SELECT 'PERSONAL ADMINISTRATIVO:' as info;
SELECT 
    p.dni,
    p.nombres,
    p.apellidos,
    p.email,
    p.telefono,
    c.denominacion as cargo,
    r.denominacion as rol,
    p.fecha_ingreso
FROM Personal p
JOIN Cargo c ON p.cod_cargo = c.cod_cargo
JOIN Rol r ON p.cod_rol = r.cod_rol
WHERE p.estado = TRUE
ORDER BY p.fecha_ingreso DESC;

-- ✅ Estadísticas generales
SELECT 'ESTADÍSTICAS GENERALES:' as info;
SELECT 
    (SELECT COUNT(*) FROM Ciudadano WHERE estado = TRUE) as total_ciudadanos,
    (SELECT COUNT(*) FROM Incidencia) as total_incidencias,
    (SELECT COUNT(*) FROM Personal WHERE estado = TRUE) as total_personal;

-- ✅ Incidencias por tipo
SELECT 'INCIDENCIAS POR TIPO:' as info;
SELECT 
    ti.denominacion as tipo,
    COUNT(*) as cantidad
FROM Incidencia i
JOIN TipoIncidencia ti ON i.cod_tipoincidencia = ti.cod_tipoincidencia
GROUP BY ti.denominacion
ORDER BY cantidad DESC;

-- ✅ Actividad reciente (últimas 24 horas)
SELECT 'ACTIVIDAD RECIENTE:' as info;
SELECT 
    'CIUDADANO' as tipo,
    CONCAT(nombres, ' ', apellidos) as detalle,
    email,
    fecha_creacion as fecha
FROM Ciudadano 
WHERE fecha_creacion >= DATE_SUB(NOW(), INTERVAL 24 HOUR)

UNION ALL

SELECT 
    'INCIDENCIA' as tipo,
    LEFT(descripcion, 50) as detalle,
    ubicacion as email,
    fecha_registro as fecha
FROM Incidencia 
WHERE fecha_registro >= DATE_SUB(NOW(), INTERVAL 24 HOUR)

ORDER BY fecha DESC;