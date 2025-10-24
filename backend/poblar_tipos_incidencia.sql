-- Datos iniciales para tipos de incidencia, falta y delito
USE sistema_incidentes_nuevo;

-- Limpiar datos existentes (opcional)
DELETE FROM TipoIncidencia;
DELETE FROM TipoDelito;
DELETE FROM TipoFalta;

-- Poblar TipoIncidencia
INSERT INTO TipoIncidencia (denominacion, descripcion) VALUES
('Robo', 'Sustracción de bienes ajenos'),
('Asalto', 'Ataque con violencia o intimidación'),
('Vandalismo', 'Destrucción o daño de propiedad'),
('Accidente de Tránsito', 'Incidente vehicular'),
('Disturbios', 'Alteración del orden público'),
('Emergencia Médica', 'Situación que requiere atención médica'),
('Incendio', 'Fuego no controlado'),
('Violencia Doméstica', 'Agresión en el ámbito familiar'),
('Tráfico de Drogas', 'Comercialización ilegal de sustancias'),
('Otros', 'Otros tipos de incidencias');

-- Poblar TipoDelito
INSERT INTO TipoDelito (denominacion, descripcion) VALUES
('Hurto', 'Sustracción sin violencia'),
('Robo Agravado', 'Sustracción con violencia'),
('Estafa', 'Engaño para obtener beneficio'),
('Homicidio', 'Muerte causada por terceros'),
('Lesiones', 'Daño físico a persona'),
('Violación', 'Agresión sexual'),
('Secuestro', 'Privación ilegal de libertad'),
('Extorsión', 'Amenaza para obtener dinero'),
('Tráfico de Drogas', 'Comercio ilegal de estupefacientes'),
('Corrupción', 'Abuso de poder público');

-- Poblar TipoFalta
INSERT INTO TipoFalta (denominacion, descripcion) VALUES
('Alteración del Orden', 'Perturbación de la paz pública'),
('Ruidos Molestos', 'Contaminación sonora'),
('Embriaguez Pública', 'Estado de ebriedad en vía pública'),
('Microtráfico', 'Venta menor de drogas'),
('Peleas Callejeras', 'Riñas en espacios públicos'),
('Grafitis', 'Pintas no autorizadas'),
('Ocupación Indebida', 'Uso ilegal de espacios'),
('Maltrato Animal', 'Crueldad hacia animales'),
('Contaminación', 'Daño al medio ambiente'),
('Infracciones de Tránsito', 'Violación de normas viales');

-- Verificar los datos insertados
SELECT 'TipoIncidencia' as tabla, COUNT(*) as registros FROM TipoIncidencia
UNION ALL
SELECT 'TipoDelito' as tabla, COUNT(*) as registros FROM TipoDelito
UNION ALL
SELECT 'TipoFalta' as tabla, COUNT(*) as registros FROM TipoFalta;