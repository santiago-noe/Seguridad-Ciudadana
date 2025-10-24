import React, { useState, useEffect, useRef, Suspense } from 'react';
import {
  Box, Drawer, IconButton, useTheme, useMediaQuery,
  AppBar, Toolbar, Typography, Avatar, Button, Divider,
  Snackbar, Alert, List, ListItem, ListItemIcon, ListItemText,
  Chip, Card, CardContent, alpha, darken, Popover, MenuItem
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  BarChart as BarChartIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  AddCircleOutline as AddIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  LocationOn as LocationIcon,
  Event as EventIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import IncidentFilterBar from '../components/IncidentFilterBar';
import IncidentRegisterPanel from '../components/IncidentRegisterPanel';
import IncidentMap from '../components/IncidentMap';
import IncidentCharts from '../components/IncidentCharts';
const ReportesLista = React.lazy(() => import('./ReportesLista'));
const UsuariosLista = React.lazy(() => import('./UsuariosLista'));
// ...existing code...

// Configuración de API
const api = axios.create({
  baseURL: 'http://127.0.0.1:4000',
});

// Componentes estilizados para el tema oscuro
const DarkCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(13,17,23,0.2)',
  border: `1px solid ${theme.palette.divider}`,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px rgba(13,17,23,0.3)',
  },
}));

const StatCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderRadius: '12px',
  padding: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(13,17,23,0.15)',
  border: `1px solid ${theme.palette.divider}`,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 6px 24px rgba(13,17,23,0.25)',
    transform: 'translateY(-3px)',
  },
}));

// Función para procesar datos de resumen
function getSummaryData(incidents) {
  const total = incidents.length;
  const byType = incidents.reduce((acc, inc) => {
    acc[inc.tipo] = (acc[inc.tipo] || 0) + 1;
    return acc;
  }, {});
  const byStatus = incidents.reduce((acc, inc) => {
    acc[inc.estado] = (acc[inc.estado] || 0) + 1;
    return acc;
  }, {});
  const recent = [...incidents].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 5);
  return { total, byType, byStatus, recent };
}

const Dashboard = () => {
  const { user } = useAuth(); // Obtener información del usuario
  const [incidents, setIncidents] = useState([]);
  const [filters, setFilters] = useState({ q: '', tipo: '', estado: '', desde: '', hasta: '' });
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [desktopDrawerOpen, setDesktopDrawerOpen] = useState(true);
  const [registerPanelOpen, setRegisterPanelOpen] = useState(false);
  const [showReportes, setShowReportes] = useState(false);
  const [showNotifPreview, setShowNotifPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [incidenciasNoVistas, setIncidenciasNoVistas] = useState([]);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const audioRef = useRef(null);
  
  // Verificar si el usuario es administrador
  const isAdmin = user && (user.rol === 'admin' || user.rol === 'administrador');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const drawerWidth = 280;

  // Filtrar incidentes
  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = !filters.q || 
      (inc.descripcion && inc.descripcion.toLowerCase().includes(filters.q.toLowerCase())) ||
      (inc.ubicacion && inc.ubicacion.toLowerCase().includes(filters.q.toLowerCase()));
    
    const matchesType = !filters.tipo || inc.tipo === filters.tipo;
    const matchesStatus = !filters.estado || inc.estado === filters.estado;
    const matchesDateFrom = !filters.desde || (inc.fecha && inc.fecha >= filters.desde);
    const matchesDateTo = !filters.hasta || (inc.fecha && inc.fecha <= filters.hasta);
    
    return matchesSearch && matchesType && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  // Obtener datos resumidos
  const summaryData = getSummaryData(filteredIncidents);

  // Cargar incidentes
  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/incidentes');
      setIncidents(res.data.map(inc => ({
        ...inc,
        latlng: inc.lat && inc.lng ? { lat: inc.lat, lng: inc.lng } : null
      })));
    } catch (error) {
      console.error('Error al cargar incidencias', error);
      showNotification('Error al cargar incidencias', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Cambiar estado de incidente
  const handleEstadoChange = async (id, nuevoEstado) => {
    try {
      await api.put(`/api/incidentes/${id}/estado`, { estado: nuevoEstado });
      showNotification('Estado actualizado', 'success');
      fetchIncidents();
    } catch (error) {
      showNotification('Error al actualizar estado', 'error');
    }
  };

  // Mostrar notificación (sin sonido por defecto)
  const showNotification = (message, severity = 'success', playSound = false) => {
    setNotification({ open: true, message, severity });
    if (playSound && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  // Manejar registro de incidente
  const handleIncidentSubmit = (nuevaIncidencia) => {
    fetchIncidents();
    setRegisterPanelOpen(false);
    showNotification('Incidencia registrada exitosamente', 'success', true);
    
    // Si hay información de la nueva incidencia, crear notificación inmediatamente
    if (nuevaIncidencia && isAdmin) {
      const nuevaNotificacion = {
        id: Date.now(), // ID temporal hasta que se refresque
        titulo: `Nueva ${nuevaIncidencia.categoria || 'incidencia'} reportada`,
        descripcion: `${nuevaIncidencia.tipo || 'Sin categoría'} en ${nuevaIncidencia.direccion || 'ubicación no especificada'}`,
        usuario: user?.nombre || 'Usuario',
        tiempo: new Date(),
        leida: false,
        incidencia: nuevaIncidencia
      };
      
      setRecentNotifications(prev => [nuevaNotificacion, ...prev].slice(0, 10));
      
      // Reproducir sonido de notificación
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.log('Error reproduciendo audio:', e));
      }
    }
  };

  // Manejar incidencias no vistas
  const marcarComoVista = (incidenciaId) => {
    setIncidenciasNoVistas(prev => prev.filter(id => id !== incidenciaId));
  };

  const marcarTodasComoVistas = () => {
    setIncidenciasNoVistas([]);
  };

  // Detectar nuevas incidencias y agregarlas a no vistas
  useEffect(() => {
    if (isAdmin && incidents.length > 0) {
      const incidenciasActuales = incidenciasNoVistas;
      const nuevasIncidencias = incidents.filter(inc => 
        !incidenciasActuales.includes(inc.id) && 
        new Date(inc.fecha_reporte || inc.fecha_creacion) > new Date(Date.now() - 30000) // Últimos 30 segundos
      );
      
      if (nuevasIncidencias.length > 0) {
        setIncidenciasNoVistas(prev => [...prev, ...nuevasIncidencias.map(inc => inc.id)]);
        
        // Agregar a notificaciones recientes con formato Facebook-style
        const nuevasNotificaciones = nuevasIncidencias.map(inc => ({
          id: inc.id,
          titulo: `Nueva ${inc.categoria || 'incidencia'} reportada`,
          descripcion: `${inc.tipo || 'Sin categoría'} en ${inc.direccion || 'ubicación no especificada'}`,
          usuario: inc.nombre_ciudadano || 'Usuario anónimo',
          tiempo: new Date(),
          leida: false,
          incidencia: inc
        }));
        
        setRecentNotifications(prev => [...nuevasNotificaciones, ...prev].slice(0, 10)); // Mantener solo las 10 más recientes
        
        // Reproducir sonido de notificación
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(e => console.log('Error reproduciendo audio:', e));
        }
      }
    }
  }, [incidents, isAdmin]);

  // Manejar dropdown de notificaciones
  const handleNotificationsClick = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const marcarNotificacionComoLeida = (notifId) => {
    setRecentNotifications(prev => 
      prev.map(notif => 
        notif.id === notifId ? { ...notif, leida: true } : notif
      )
    );
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchIncidents();
    
    // Solicitar permisos de notificación para admins
    if (isAdmin && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [isAdmin]);

  // Polling para detectar nuevas incidencias (solo para admins)
  useEffect(() => {
    if (!isAdmin) return;

    const interval = setInterval(async () => {
      try {
        const response = await api.get('/incidencias');
        const nuevasIncidencias = response.data.incidencias || [];
        
        // Comparar con las incidencias actuales
        const incidenciasActualesIds = incidents.map(inc => inc.id);
        const incidenciasReales = nuevasIncidencias.filter(inc => 
          !incidenciasActualesIds.includes(inc.id)
        );
        
        if (incidenciasReales.length > 0) {
          console.log('🆕 Nuevas incidencias detectadas vía polling:', incidenciasReales.length);
          
          // Actualizar la lista de incidencias
          setIncidents(nuevasIncidencias);
          
          // Crear notificaciones para las nuevas incidencias
          const nuevasNotificaciones = incidenciasReales.map(inc => ({
            id: inc.id,
            titulo: `Nueva ${inc.categoria || 'incidencia'} reportada`,
            descripcion: `${inc.tipo || 'Sin categoría'} en ${inc.direccion || 'ubicación no especificada'}`,
            usuario: inc.nombre_ciudadano || 'Usuario anónimo',
            tiempo: new Date(inc.fecha_reporte || inc.fecha_creacion),
            leida: false,
            incidencia: inc
          }));
          
          setRecentNotifications(prev => [...nuevasNotificaciones, ...prev].slice(0, 10));
          setIncidenciasNoVistas(prev => [...prev, ...incidenciasReales.map(inc => inc.id)]);
          
          // Reproducir sonido si hay nuevas incidencias
          if (audioRef.current && incidenciasReales.length > 0) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => console.log('Error reproduciendo audio:', e));
          }
          
          // Notificación del navegador
          if (Notification.permission === 'granted' && incidenciasReales.length > 0) {
            new Notification('🚨 Nueva Incidencia Registrada', {
              body: `${incidenciasReales[0].tipo || 'Nueva incidencia'} reportada por ${incidenciasReales[0].nombre_ciudadano || 'un usuario'}`,
              icon: '/logo192.png',
              tag: 'nueva-incidencia'
            });
          }
        }
      } catch (error) {
        console.error('Error en polling de incidencias:', error);
      }
    }, 10000); // Revisar cada 10 segundos

    return () => clearInterval(interval);
  }, [incidents, isAdmin]);

  // Elementos del menú
  const [showUsuarios, setShowUsuarios] = useState(false);
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, selected: !showReportes && !showUsuarios },
    { text: 'Reportes', icon: <BarChartIcon />, selected: showReportes },
    { text: 'Usuarios', icon: <PeopleIcon />, selected: showUsuarios },
    { text: 'Estadísticas', icon: <AssessmentIcon />, selected: false },
  ];

  // Drawer para navegación
  const renderDrawer = () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      background: theme.palette.background.paper,
      color: theme.palette.text.primary,
      boxShadow: '2px 0 10px rgba(13,17,23,0.08)'
    }}>
      {/* Encabezado del drawer */}
      <Box sx={{ p: 3, textAlign: 'center', borderBottom: `1px solid ${alpha('#fff', 0.1)}` }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2
        }}>
          <SecurityIcon sx={{ fontSize: 32, mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            Seguridad Ciudadana
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>
          San Juan Bautista
        </Typography>
  </Box>
  {/* Audio para notificación */}
  <audio ref={audioRef} src="/notificacion.mp3" preload="auto" style={{ display: 'none' }} />

      {/* Información de usuario */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
        <Avatar 
          src="/mi_foto.jpg"
          sx={{ width: 48, height: 48, border: '2px solid #6366f1' }}
        />
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            {user?.nombreCompleto || user?.nombres + ' ' + user?.apellidos || 'Usuario'}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7, fontSize: '0.75rem' }}>
            {user?.tipo === 'personal' ? (user?.cargo || 'Personal') : 'Ciudadano'}
            {user?.tipo === 'personal' && user?.estado === 'activo' ? ' Activo' : ''}
          </Typography>
        </Box>
      </Box>

  <Divider sx={{ bgcolor: theme.palette.divider, my: 2 }} />

      {/* Navegación */}
      <List sx={{ flexGrow: 1, px: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            selected={item.selected}
            sx={{
              mb: 1,
              borderRadius: 2,
              '&.Mui-selected': {
                backgroundColor: alpha(theme.palette.primary.main, 0.12),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.18),
                },
              },
            }}
            onClick={() => {
              if (item.text === 'Reportes') {
                setShowReportes(true);
                setShowUsuarios(false);
              } else if (item.text === 'Usuarios') {
                setShowUsuarios(true);
                setShowReportes(false);
              } else {
                setShowReportes(false);
                setShowUsuarios(false);
              }
            }}
          >
            <ListItemIcon sx={{ color: item.selected ? theme.palette.primary.main : theme.palette.text.secondary, minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ 
                fontWeight: item.selected ? 600 : 400,
                color: item.selected ? theme.palette.primary.main : theme.palette.text.primary
              }} 
            />
            {item.selected && (
              <Box sx={{ width: 4, height: 24, bgcolor: theme.palette.primary.main, borderRadius: '4px 0 0 4px', ml: 1 }} />
            )}
          </ListItem>
        ))}
      </List>

      {/* Pie del drawer */}
      <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="caption" sx={{ opacity: 0.6, display: 'block', textAlign: 'center', color: theme.palette.text.secondary }}>
          © 2025 Municipalidad
        </Typography>
      </Box>
    </Box>
  );

  // Componente para las tarjetas de estadísticas
  const StatisticCard = ({ title, value, icon, color, subtitle }) => (
    <StatCard>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
            {value}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ opacity: 0.6 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{
          background: alpha(color, 0.2),
          borderRadius: '12px',
          p: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {React.cloneElement(icon, { sx: { fontSize: 28, color } })}
        </Box>
      </Box>
    </StatCard>
  );

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      bgcolor: theme.palette.background.default,
      color: theme.palette.text.primary,
    }}>
      {/* AppBar para móviles */}
      {isMobile && (
        <AppBar 
          position="fixed" 
          sx={{ 
            zIndex: theme.zIndex.drawer + 1,
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: '0 2px 15px rgba(0,0,0,0.05)'
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              Seguridad Ciudadana
            </Typography>
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      {/* Drawer para navegación */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              background: theme.palette.background.paper,
              color: theme.palette.text.primary,
            },
          }}
        >
          {renderDrawer()}
        </Drawer>
      ) : (
        <Drawer
          variant="persistent"
          open={desktopDrawerOpen}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              border: 'none',
              background: theme.palette.background.paper,
              color: theme.palette.text.primary,
            },
          }}
        >
          {renderDrawer()}
        </Drawer>
      )}

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${desktopDrawerOpen ? drawerWidth : 0}px)` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          mt: isMobile ? 8 : 0,
          background: theme.palette.background.default,
          minHeight: '100vh',
          color: theme.palette.text.primary,
        }}
      >
        {/* Encabezado */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box>
            <Typography variant="h3" component="h1" sx={{ 
              fontWeight: 'bold', 
              background: 'linear-gradient(45deg, #818cf8, #6366f1)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}>
              Dashboard de Seguridad
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Monitoreo en tiempo real de incidencias en San Juan Bautista
            </Typography>
          </Box>
          
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <IconButton sx={{ 
                color: 'rgba(255,255,255,0.7)',
                background: alpha('#6366f1', 0.1),
                '&:hover': {
                  background: alpha('#6366f1', 0.2),
                }
              }}
                onClick={handleNotificationsClick}
              >
                <Badge badgeContent={incidenciasNoVistas.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setRegisterPanelOpen(true)}
                sx={{
                  background: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  fontWeight: 'bold',
                  borderRadius: 2,
                  boxShadow: '0 4px 14px rgba(45,108,223,0.15)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(45,108,223,0.25)',
                    background: theme.palette.primary.dark,
                  }
                }}
              >
                Nueva Incidencia
              </Button>
            </Box>
          )}
        </Box>

        {/* Mostrar solo la sección seleccionada */}
        {showUsuarios ? (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: '#6366f1' }}>
              Usuarios Registrados
            </Typography>
            <Suspense fallback={<div>Cargando usuarios...</div>}>
              <UsuariosLista />
            </Suspense>
          </Box>
        ) : showReportes ? (
          <Suspense fallback={<div>Cargando reportes...</div>}>
            <ReportesLista 
              incidentes={filteredIncidents} 
              onEstadoChange={handleEstadoChange} 
              isAdmin={isAdmin}
              incidenciasNoVistas={incidenciasNoVistas}
              marcarComoVista={marcarComoVista}
              marcarTodasComoVistas={marcarTodasComoVistas}
            />
          </Suspense>
        ) : (
          <>
            {/* Tarjetas de estadísticas */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 3, 
              mb: 4 
            }}>
              <StatisticCard 
                title="Total Incidentes" 
                value={summaryData.total} 
                icon={<WarningIcon />} 
                color="#6366f1" 
                subtitle="Todos los reportes"
              />
              <StatisticCard 
                title="Pendientes" 
                value={summaryData.byStatus.pendiente || 0} 
                icon={<ErrorIcon />} 
                color="#f59e0b" 
                subtitle="Por resolver"
              />
              <StatisticCard 
                title="En Proceso" 
                value={summaryData.byStatus['en proceso'] || 0} 
                icon={<InfoIcon />} 
                color="#3b82f6" 
                subtitle="En atención"
              />
              <StatisticCard 
                title="Resueltos" 
                value={summaryData.byStatus.resuelto || 0} 
                icon={<CheckCircleIcon />} 
                color="#10b981" 
                subtitle="Solucionados"
              />
            </Box>
            {/* Filtros */}
            <DarkCard sx={{ mb: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2 
                }}>
                  <FilterIcon sx={{ mr: 1, color: '#818cf8' }} />
                  <Typography variant="h6" component="h2">
                    Filtros de Búsqueda
                  </Typography>
                </Box>
                <Suspense fallback={<div>Cargando filtros...</div>}>
                  <IncidentFilterBar 
                    filters={filters} 
                    setFilters={setFilters} 
                    darkMode={true}
                  />
                </Suspense>
              </CardContent>
            </DarkCard>
            {/* Mapa y Gráficos */}
            {loading ? (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '400px',
                background: alpha('#000', 0.2),
                borderRadius: 3
              }}>
                <Typography>Cargando datos de incidencias...</Typography>
              </Box>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', lg: 'row' }, 
                gap: 3, 
                mb: 3 
              }}>
                {/* Mapa */}
                <Box sx={{ 
                  flex: { lg: 2 }, 
                  minHeight: 500,
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  border: `1px solid ${alpha('#fff', 0.1)}`
                }}>
                  <Suspense fallback={<div>Cargando mapa...</div>}>
                    <IncidentMap incidents={filteredIncidents} darkMode={true} />
                  </Suspense>
                </Box>
                {/* Gráficos */}
                <Box sx={{ 
                  flex: { lg: 1 }, 
                  minWidth: { md: 300 }
                }}>
                  <Suspense fallback={<div>Cargando gráficos...</div>}>
                    <IncidentCharts incidents={filteredIncidents} darkMode={true} />
                  </Suspense>
                </Box>
              </Box>
            )}
          </>
        )}
        {/* Previsualización de notificaciones */}
        {showNotifPreview && (
          <DarkCard sx={{ position: 'fixed', top: 80, right: 32, zIndex: 9999, width: 350 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotificationsIcon sx={{ mr: 1, color: '#818cf8' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: 16 }}>Incidentes recientes</Typography>
                <IconButton sx={{ ml: 'auto', color: 'white' }} onClick={() => setShowNotifPreview(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box sx={{ maxHeight: 320, overflowY: 'auto', pr: 1 }}>
                {summaryData.recent.length === 0 ? (
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                    No hay incidentes recientes.
                  </Typography>
                ) : (
                  summaryData.recent.map((inc) => (
                    <Card key={inc.id} sx={{ mb: 2, background: 'rgba(99,102,241,0.08)', color: 'white', borderRadius: 2 }}>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: 14 }}>{inc.tipo} - {inc.ubicacion}</Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{inc.descripcion}</Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Fecha: {inc.fecha}</Typography>
                        <Chip label={inc.estado || 'pendiente'} color={inc.estado === 'resuelto' ? 'success' : 'warning'} sx={{ ml: 2, fontSize: 12 }} />
                        <Button size="small" sx={{ mt: 1, color: '#6366f1', fontSize: 13 }} onClick={() => { setShowReportes(true); setShowNotifPreview(false); }}>Ver en Reportes</Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </Box>
            </CardContent>
          </DarkCard>
        )}

        {/* Popover de Notificaciones estilo Facebook */}
        <Popover
          open={Boolean(notificationsAnchor)}
          anchorEl={notificationsAnchor}
          onClose={handleNotificationsClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          sx={{
            mt: 1,
            '& .MuiPaper-root': {
              maxWidth: 380,
              maxHeight: 500,
              borderRadius: 3,
              boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
              border: `1px solid ${theme.palette.divider}`,
            }
          }}
        >
          <Box sx={{ p: 0 }}>
            <Box sx={{ 
              p: 2, 
              borderBottom: `1px solid ${theme.palette.divider}`,
              background: theme.palette.background.paper
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 18 }}>
                Notificaciones
              </Typography>
              {recentNotifications.filter(n => !n.leida).length > 0 && (
                <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontSize: 13 }}>
                  {recentNotifications.filter(n => !n.leida).length} nuevas
                </Typography>
              )}
            </Box>
            
            <List sx={{ p: 0, maxHeight: 400, overflow: 'auto' }}>
              {recentNotifications.length === 0 ? (
                <ListItem sx={{ textAlign: 'center', py: 4 }}>
                  <ListItemText 
                    primary="No hay notificaciones"
                    secondary="Cuando haya nuevas incidencias aparecerán aquí"
                    sx={{ color: theme.palette.text.secondary }}
                  />
                </ListItem>
              ) : (
                recentNotifications.map((notif) => (
                  <ListItem 
                    key={notif.id}
                    onClick={() => {
                      marcarNotificacionComoLeida(notif.id);
                      marcarComoVista(notif.id);
                      setShowReportes(true);
                      handleNotificationsClose();
                    }}
                    sx={{
                      cursor: 'pointer',
                      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                      background: notif.leida ? 'transparent' : alpha(theme.palette.primary.main, 0.05),
                      '&:hover': {
                        background: alpha(theme.palette.primary.main, 0.08)
                      },
                      py: 1.5,
                      px: 2
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Avatar sx={{ 
                        width: 32, 
                        height: 32,
                        background: theme.palette.primary.main,
                        fontSize: 14
                      }}>
                        🚨
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={{ 
                          fontWeight: notif.leida ? 'normal' : 'bold',
                          fontSize: 14,
                          color: theme.palette.text.primary
                        }}>
                          {notif.titulo}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography sx={{ 
                            fontSize: 13,
                            color: theme.palette.text.secondary,
                            mt: 0.5
                          }}>
                            {notif.descripcion}
                          </Typography>
                          <Typography sx={{ 
                            fontSize: 12,
                            color: theme.palette.text.disabled,
                            mt: 0.5
                          }}>
                            Por: {notif.usuario} • {new Date(notif.tiempo).toLocaleTimeString('es-PE', { 
                              hour: '2-digit', 
                              minute: '2-digit'
                            })}
                          </Typography>
                        </Box>
                      }
                    />
                    {!notif.leida && (
                      <Box sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: theme.palette.primary.main,
                        ml: 1
                      }} />
                    )}
                  </ListItem>
                ))
              )}
            </List>
            
            {recentNotifications.length > 0 && (
              <Box sx={{ 
                p: 1.5, 
                borderTop: `1px solid ${theme.palette.divider}`,
                textAlign: 'center'
              }}>
                <Button 
                  onClick={() => {
                    setShowReportes(true);
                    handleNotificationsClose();
                  }}
                  sx={{ 
                    fontSize: 13,
                    color: theme.palette.primary.main
                  }}
                >
                  Ver todos los reportes
                </Button>
              </Box>
            )}
          </Box>
        </Popover>

        {/* Notificación */}
        <Snackbar 
          open={notification.open} 
          autoHideDuration={4000} 
          onClose={() => setNotification({ ...notification, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setNotification({ ...notification, open: false })} 
            severity={notification.severity}
            sx={{ 
              width: '100%', 
              background: '#1f2937',
              color: 'white',
              '& .MuiAlert-icon': { color: 'white' }
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Dashboard;