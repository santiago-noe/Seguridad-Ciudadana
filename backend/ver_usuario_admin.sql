-- ===============================
-- VER USUARIO ADMIN CREADO
-- ===============================

USE sistema_incidentes_nuevo;

-- 1. Ver el ciudadano admin
SELECT '=== CIUDADANO ADMIN ===' as info;
SELECT * FROM Ciudadano WHERE email = 'admin@seguridad.com';

-- 2. Ver el personal admin con todos los detalles
SELECT '=== PERSONAL ADMIN ===' as info;
SELECT 
    p.codigo,
    p.dni,
    p.nombres,
    p.apellidos,
    p.email,
    p.telefono,
    p.direccion,
    p.fecha_ingreso,
    p.estado,
    c.denominacion as cargo,
    r.denominacion as rol
FROM Personal p
LEFT JOIN Cargo c ON p.cod_cargo = c.cod_cargo
LEFT JOIN Rol r ON p.cod_rol = r.cod_rol
WHERE p.email = 'admin@seguridad.com';

-- 3. Ver todos los cargos disponibles
SELECT '=== CARGOS DISPONIBLES ===' as info;
SELECT * FROM Cargo ORDER BY cod_cargo;

-- 4. Ver todos los roles disponibles
SELECT '=== ROLES DISPONIBLES ===' as info;
SELECT * FROM Rol ORDER BY cod_rol;

-- 5. Ver TODOS los usuarios en Personal
SELECT '=== TODOS LOS USUARIOS PERSONAL ===' as info;
SELECT 
    p.codigo,
    p.dni,
    p.nombres,
    p.apellidos,
    p.email,
    c.denominacion as cargo,
    r.denominacion as rol,
    p.estado
FROM Personal p
LEFT JOIN Cargo c ON p.cod_cargo = c.cod_cargo
LEFT JOIN Rol r ON p.cod_rol = r.cod_rol
ORDER BY p.fecha_ingreso DESC;

-- 6. Ver TODOS los ciudadanos
SELECT '=== TODOS LOS CIUDADANOS ===' as info;
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

-- 7. Contar registros totales
SELECT '=== RESUMEN DE USUARIOS ===' as info;
SELECT 
    (SELECT COUNT(*) FROM Ciudadano) as total_ciudadanos,
    (SELECT COUNT(*) FROM Personal) as total_personal,
    (SELECT COUNT(*) FROM Personal WHERE email = 'admin@seguridad.com') as admin_existe;