import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Card, CardContent, Typography, Box } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Arreglar iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente para actualizar la vista del mapa
const MapUpdater = ({ incidents }) => {
  const map = useMap();
  
  useEffect(() => {
    if (incidents && incidents.length > 0) {
      const validIncidents = incidents.filter(inc => inc.lat && inc.lng);
      if (validIncidents.length > 0) {
        const bounds = validIncidents.map(inc => [inc.lat, inc.lng]);
        if (bounds.length === 1) {
          map.setView(bounds[0], 15);
        } else {
          map.fitBounds(bounds, { padding: [20, 20] });
        }
      }
    }
  }, [incidents, map]);
  
  return null;
};

const IncidentMap = ({ incidents = [] }) => {
  const mapRef = useRef();
  
  // Filtrar incidentes con coordenadas válidas
  const incidentsWithCoords = incidents.filter(inc => 
    inc.lat && inc.lng && 
    !isNaN(inc.lat) && !isNaN(inc.lng)
  );

  // Coordenadas por defecto (Ayacucho, Perú)
  const defaultCenter = [-13.1588, -74.2239];
  const defaultZoom = 13;

  const getMarkerColor = (categoria) => {
    switch (categoria) {
      case 'Delito':
        return '#e53e3e'; // Rojo
      case 'Falta':
        return '#fd7f28'; // Naranja
      default:
        return '#4299e1'; // Azul
    }
  };

  return (
    <Card sx={{ height: 400, mb: 3 }}>
      <CardContent sx={{ p: 2, height: '100%' }}>
        <Typography variant="h6" gutterBottom sx={{ fontSize: 16, fontWeight: 'bold' }}>
          Mapa de Incidencias
          {incidentsWithCoords.length > 0 && (
            <span style={{ marginLeft: 8, fontSize: 14, fontWeight: 'normal', color: '#666' }}>
              ({incidentsWithCoords.length} ubicaciones)
            </span>
          )}
        </Typography>
        
        <Box sx={{ height: 320, borderRadius: 1, overflow: 'hidden' }}>
          <MapContainer
            center={defaultCenter}
            zoom={defaultZoom}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MapUpdater incidents={incidentsWithCoords} />
            
            {incidentsWithCoords.map((incident) => (
              <Marker 
                key={incident.id} 
                position={[incident.lat, incident.lng]}
              >
                <Popup>
                  <div style={{ minWidth: 200 }}>
                    <strong style={{ color: getMarkerColor(incident.categoria) }}>
                      {incident.categoria || 'General'}: {incident.tipo || 'Sin especificar'}
                    </strong>
                    <br />
                    <div style={{ marginTop: 4, fontSize: 13 }}>
                      <strong>Descripción:</strong><br />
                      {incident.descripcion || 'Sin descripción'}
                    </div>
                    <div style={{ marginTop: 4, fontSize: 13 }}>
                      <strong>Ubicación:</strong><br />
                      {incident.direccion || 'Sin dirección'}
                    </div>
                    <div style={{ marginTop: 4, fontSize: 12, color: '#666' }}>
                      Estado: {incident.estado || 'pendiente'}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </Box>
        
        {incidentsWithCoords.length === 0 && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: 260,
            color: '#666',
            fontSize: 14
          }}>
            No hay incidencias con ubicación disponible
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default IncidentMap;