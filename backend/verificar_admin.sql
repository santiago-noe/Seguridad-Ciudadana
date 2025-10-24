-- Verificar si el usuario admin existe y está bien configurado
USE sistema_incidentes_nuevo;

-- Ver si existe el ciudadano admin
SELECT 'CIUDADANO ADMIN:' as info;
SELECT * FROM Ciudadano WHERE email = 'admin@seguridad.com';

-- Ver si existe el personal admin  
SELECT 'PERSONAL ADMIN:' as info;
SELECT 
    p.codigo,
    p.dni,
    p.nombres,
    p.apellidos,
    p.email,
    p.telefono,
    p.estado,
    c.denominacion as cargo,
    r.denominacion as rol
FROM Personal p
LEFT JOIN Cargo c ON p.cod_cargo = c.cod_cargo
LEFT JOIN Rol r ON p.cod_rol = r.cod_rol
WHERE p.email = 'admin@seguridad.com';

-- Ver si las tablas Cargo y Rol tienen datos
SELECT 'CARGOS DISPONIBLES:' as info;
SELECT * FROM Cargo;

SELECT 'ROLES DISPONIBLES:' as info;  
SELECT * FROM Rol;