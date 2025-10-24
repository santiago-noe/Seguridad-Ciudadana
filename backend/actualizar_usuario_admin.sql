-- Actualizar el usuario Admin Sistema para que sea Técnico - Operador
USE sistema_incidentes_nuevo;

-- Verificar el usuario actual
SELECT p.*, c.nombres_cargo, r.nombres_rol 
FROM Personal p
LEFT JOIN Cargo c ON p.id_cargo = c.id_cargo
LEFT JOIN Rol r ON p.id_rol = r.id_rol
WHERE p.email = '01sistemas@gmail.com';

-- Obtener los IDs de Técnico y Operador
SELECT id_cargo, nombres_cargo FROM Cargo WHERE nombres_cargo = 'Técnico';
SELECT id_rol, nombres_rol FROM Rol WHERE nombres_rol = 'Operador';

-- Actualizar el usuario para que sea Técnico - Operador
UPDATE Personal 
SET 
    id_cargo = (SELECT id_cargo FROM Cargo WHERE nombres_cargo = 'Técnico'),
    id_rol = (SELECT id_rol FROM Rol WHERE nombres_rol = 'Operador')
WHERE email = '01sistemas@gmail.com';

-- Verificar la actualización
SELECT p.*, c.nombres_cargo, r.nombres_rol 
FROM Personal p
LEFT JOIN Cargo c ON p.id_cargo = c.id_cargo
LEFT JOIN Rol r ON p.id_rol = r.id_rol
WHERE p.email = '01sistemas@gmail.com';