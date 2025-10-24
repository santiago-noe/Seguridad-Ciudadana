import React, { useState, useEffect, useRef } from 'react';
import { useTheme, alpha } from '@mui/material/styles';
import { List, ListItem, ListItemText, Card, CardContent, Typography, Chip, MenuItem, Select, Badge, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, NotificationsActive } from '@mui/icons-material';
import axios from 'axios';

// Configurar axios para el backend
axios.defaults.baseURL = 'http://127.0.0.1:4000';

const estados = ['pendiente', 'en proceso', 'resuelto'];

const ReportesLista = ({ 
  incidentes, 
  selectedId, 
  onEstadoChange, 
  isAdmin = false,
  incidenciasNoVistas = [],
  marcarComoVista,
  marcarTodasComoVistas
}) => {
  const theme = useTheme();
  const audioRef = useRef(null);
  const [lastCheck, setLastCheck] = useState(new Date().toISOString());
  
  // Cargar audio de notificación
  useEffect(() => {
    audioRef.current = new Audio('/notificacion.mp3');
    audioRef.current.volume = 0.7;
  }, []);

  // Función para reproducir sonido de notificación
  const reproducirNotificacion = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Error reproduciendo audio:', e));
    }
  };

  // Solicitar permisos de notificación
  useEffect(() => {
    if (isAdmin && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, [isAdmin]);

  // Polling simplificado - revisar cuando cambian las incidencias
  useEffect(() => {
    if (!isAdmin || !incidentes?.length) return;

    // Si hay nuevas incidencias, reproducir sonido
    const nuevasIncidencias = incidentes.filter(inc => {
      const fechaIncidencia = new Date(inc.fecha_creacion || inc.fecha);
      return fechaIncidencia > new Date(lastCheck);
    });

    if (nuevasIncidencias.length > 0) {
      console.log('🆕 Nuevas incidencias detectadas:', nuevasIncidencias.length);
      reproducirNotificacion();
      
      // Mostrar notificación del navegador
      if (Notification.permission === 'granted') {
        new Notification('Nueva Incidencia Registrada', {
          body: `Se han registrado ${nuevasIncidencias.length} nueva(s) incidencia(s)`,
          icon: '/logo192.png'
        });
      }
      
      setLastCheck(new Date().toISOString());
    }
  }, [incidentes, isAdmin, lastCheck]);

  // Polling para actualizar el timestamp (comentado para evitar APIs inexistentes)
  /*useEffect(() => {
    if (!isAdmin) return;

    const checkNuevasIncidencias = async () => {
      try {
        // Este endpoint no existe aún, lo comentamos
        // const response = await axios.get(`/api/incidentes/recientes/${lastCheck}`);
      } catch (error) {
        console.error('Error checking nuevas incidencias:', error);
      }
    };

    // Solicitar permiso para notificaciones
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Polling cada 5 segundos
    const interval = setInterval(checkNuevasIncidencias, 5000);
    return () => clearInterval(interval);
  }, [isAdmin, lastCheck]); */

  // Cargar incidencias no vistas (comentado por API inexistente)
  /*useEffect(() => {
    if (!isAdmin) return;
    
    const cargarNoVistas = async () => {
      try {
        const response = await axios.get('/api/incidentes/no-vistas');
        if (response.data.success) {
          setIncidenciasNoVistas(response.data.incidencias.map(inc => inc.id));
        }
      } catch (error) {
        console.error('Error cargando incidencias no vistas:', error);
      }
    };

    cargarNoVistas();
  }, [isAdmin, incidentes]); */

  // Las funciones marcarComoVista y marcarTodasComoVistas vienen por props del Dashboard

  // Verificar si una incidencia es nueva (no vista)
  const esIncidenciaNoVista = (incidenciaId) => {
    return isAdmin && incidenciasNoVistas.includes(incidenciaId);
  };

  return (
    <Card sx={{ 
      mb: 4, 
      background: theme.palette.background.paper, 
      color: theme.palette.text.primary, 
      borderRadius: 3, 
      boxShadow: '0 4px 20px rgba(13,17,23,0.15)', 
      border: `1px solid ${theme.palette.divider}` 
    }}>
      <CardContent>
        <Typography variant="h5" sx={{ 
          mb: 2, 
          fontWeight: 'bold', 
          fontSize: 18, 
          color: theme.palette.primary.main,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <NotificationsActive />
          Reportes de Usuarios
          {isAdmin && incidenciasNoVistas.length > 0 && (
            <>
              <Badge badgeContent={incidenciasNoVistas.length} color="warning" sx={{ ml: 1 }}>
                <Chip 
                  label="Nuevos" 
                  color="warning" 
                  size="small"
                  sx={{ 
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 1 },
                      '50%': { opacity: 0.5 }
                    }
                  }}
                />
              </Badge>
              <IconButton 
                onClick={marcarTodasComoVistas}
                size="small"
                sx={{ 
                  ml: 1, 
                  color: theme.palette.warning.main,
                  '&:hover': { backgroundColor: alpha(theme.palette.warning.main, 0.1) }
                }}
                title="Marcar todas como vistas"
              >
                <VisibilityOff fontSize="small" />
              </IconButton>
            </>
          )}
        </Typography>
        <List>
          {incidentes.length === 0 ? (
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: 13 }}>
              No hay reportes registrados.
            </Typography>
          ) : (
            incidentes.map((inc) => {
              const isNoVista = esIncidenciaNoVista(inc.id);
              const isSelected = selectedId === inc.id;
              
              // Debug: mostrar datos de la incidencia
              console.log('🔍 Incidencia:', {
                id: inc.id,
                categoria: inc.categoria,
                tipo: inc.tipo,
                fecha: inc.fecha,
                hora: inc.hora,
                fecha_creacion: inc.fecha_creacion,
                cod_tipofalta: inc.cod_tipofalta,
                cod_tipodelito: inc.cod_tipodelito
              });
              
              return (
                <ListItem 
                  key={inc.id} 
                  data-reporte-id={inc.id}
                  onClick={() => isAdmin && isNoVista && marcarComoVista(inc.id)}
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    background: isSelected 
                      ? theme.palette.primary.main 
                      : isNoVista 
                        ? 'linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)'
                        : theme.palette.background.default,
                    color: isSelected 
                      ? theme.palette.primary.contrastText 
                      : isNoVista 
                        ? '#000'
                        : theme.palette.text.primary,
                    boxShadow: isSelected 
                      ? `0 0 0 2px ${theme.palette.primary.main}` 
                      : isNoVista 
                        ? '0 0 10px rgba(255, 152, 0, 0.5)'
                        : undefined,
                    fontWeight: isSelected || isNoVista ? 'bold' : 'normal',
                    transition: 'all 0.3s ease',
                    cursor: isAdmin && isNoVista ? 'pointer' : 'default',
                    position: 'relative',
                    '&:hover': isAdmin && isNoVista ? {
                      background: 'linear-gradient(45deg, #ff9800 60%, #ffb74d 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 15px rgba(255, 152, 0, 0.7)'
                    } : {}
                  }}>
                  
                  {/* Indicador de nueva incidencia */}
                  {isNoVista && (
                    <div
                      style={{
                        position: 'absolute',
                        top: -5,
                        right: -5,
                        width: 20,
                        height: 20,
                        background: '#f44336',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 12,
                        fontWeight: 'bold',
                        zIndex: 1,
                        animation: 'bounce 1s infinite'
                      }}
                    >
                      !
                    </div>
                  )}
                  
                  <ListItemText
                    primary={
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {/* Primera línea: Incidencia: [Categoría] */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ 
                            fontSize: 14, 
                            fontWeight: 'bold', 
                            color: (() => {
                              if (isSelected) return theme.palette.primary.contrastText;
                              if (isNoVista) return '#000';
                              // Color según categoría
                              if (inc.categoria === 'Delito') return '#d32f2f'; // Rojo para delitos
                              if (inc.categoria === 'Falta') return '#f57c00'; // Naranja para faltas
                              return '#1976d2'; // Azul para general
                            })()
                          }}>
                            {(() => {
                              // Si tiene categoria definida
                              if (inc.categoria && inc.categoria !== 'Sin clasificar') {
                                return `Incidencia: ${inc.categoria}`;
                              }
                              // Si no está clasificado
                              return 'Incidencia: General';
                            })()}
                          </span>
                          {isNoVista && (
                            <Chip 
                              label="NUEVO" 
                              size="small"
                              sx={{ 
                                background: '#f44336', 
                                color: 'white', 
                                fontSize: 10,
                                height: 20,
                                animation: 'pulse 1.5s infinite'
                              }}
                            />
                          )}
                        </div>
                        
                        {/* Segunda línea: Tipo específico */}
                        {inc.tipo && inc.tipo !== 'Sin tipo especificado' && (
                          <span style={{ 
                            fontSize: 13, 
                            fontWeight: 'medium', 
                            color: isSelected 
                              ? theme.palette.primary.contrastText 
                              : isNoVista 
                                ? '#000' 
                                : '#666',
                            marginLeft: '8px'
                          }}>
                            {inc.tipo}
                          </span>
                        )}
                      </div>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" sx={{ 
                          color: isSelected 
                            ? theme.palette.primary.contrastText 
                            : isNoVista 
                              ? '#000' 
                              : theme.palette.text.secondary, 
                          fontSize: 13,
                          fontWeight: 'medium'
                        }}>
                          📍 {inc.direccion || 'Dirección no especificada'}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: isSelected 
                            ? theme.palette.primary.contrastText 
                            : isNoVista 
                              ? '#000' 
                              : theme.palette.text.secondary, 
                          fontSize: 13,
                          mt: 0.5
                        }}>
                          📝 {inc.descripcion || 'Sin descripción'}
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          color: isSelected 
                            ? theme.palette.primary.contrastText 
                            : isNoVista 
                              ? '#000' 
                              : theme.palette.text.disabled, 
                          fontSize: 12,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mt: 0.5
                        }}>
                          🕒 {(() => {
                            // Intentar diferentes formatos de fecha
                            const fecha = inc.fecha || inc.fecha_creacion;
                            if (fecha) {
                              try {
                                const fechaObj = new Date(fecha);
                                if (fechaObj.getTime() && !isNaN(fechaObj.getTime())) {
                                  const fechaFormateada = fechaObj.toLocaleDateString('es-PE');
                                  return `${fechaFormateada}${inc.hora ? ` - ${inc.hora}` : ''}`;
                                }
                              } catch (e) {
                                console.error('Error al formatear fecha:', e);
                              }
                            }
                            return 'Sin fecha registrada';
                          })()}
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          color: isSelected 
                            ? theme.palette.primary.contrastText 
                            : isNoVista 
                              ? '#000' 
                              : theme.palette.text.disabled, 
                          fontSize: 12,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          👤 {inc.nombre_ciudadano || 'Ciudadano anónimo'}
                        </Typography>
                      </>
                    }
                  />
                  
                  {/* Botón para marcar como vista (solo admin) */}
                  {isAdmin && isNoVista && (
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        marcarComoVista(inc.id);
                      }}
                      sx={{ 
                        ml: 1, 
                        color: '#000',
                        '&:hover': { 
                          background: 'rgba(0,0,0,0.1)' 
                        }
                      }}
                      title="Marcar como vista"
                    >
                      <VisibilityOff />
                    </IconButton>
                  )}
                  
                  <Select
                    value={inc.estado || 'pendiente'}
                    onChange={e => onEstadoChange && onEstadoChange(inc.id, e.target.value)}
                    sx={{ 
                      ml: 2, 
                      fontSize: 12, 
                      color: isSelected 
                        ? theme.palette.primary.contrastText 
                        : isNoVista 
                          ? '#000' 
                          : theme.palette.text.primary, 
                      background: theme.palette.background.paper, 
                      borderRadius: 1 
                    }}
                    size="small"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {estados.map(est => (
                      <MenuItem key={est} value={est}>{est}</MenuItem>
                    ))}
                  </Select>
                </ListItem>
              );
            })
          )}
        </List>
        
        {/* Estilos CSS para animaciones */}
        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }
          
          .notification-sound {
            display: none;
          }
        `}</style>
      </CardContent>
    </Card>
  );
};

export default ReportesLista;
