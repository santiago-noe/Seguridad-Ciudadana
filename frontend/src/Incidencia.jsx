import React, { useState, useEffect } from "react";
import {
  Box, Drawer, IconButton, useTheme, useMediaQuery,
  AppBar, Toolbar, Typography, Avatar, Button, Divider,
  List, ListItem, ListItemIcon, ListItemText,
  alpha, Container, Paper, Grid, Dialog, DialogTitle, 
  DialogContent, ListItemButton
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  BarChart as BarChartIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  AddCircleOutline as AddIcon,
  Security as SecurityIcon,
  LocationOn as LocationIcon,
  Event as EventIcon,
  FilterList as FilterIcon,
  Home as HomeIcon,
  Report as ReportIcon,
  Assignment as AssignmentIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
  Close as CloseIcon,
  Lightbulb as LightbulbIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import IncidentRegisterPanel from "./components/IncidentRegisterPanel";
import { useAuth } from "./contexts/AuthContext";
import axios from "axios";

// Configurar axios para el backend
axios.defaults.baseURL = 'http://127.0.0.1:4000';

const Incidencia = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [lastReportData, setLastReportData] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [desktopDrawerOpen, setDesktopDrawerOpen] = useState(true);
  const [registerPanelOpen, setRegisterPanelOpen] = useState(false);
  const [showReportes, setShowReportes] = useState(false);
  const [showUsuarios, setShowUsuarios] = useState(false);

  // Obtener datos del usuario desde el contexto de autenticación
  const { user, loading, error, logout } = useAuth();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const drawerWidth = 280;

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      if (mobile) {
        setMobileDrawerOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Elementos del menú (igual que el Dashboard)
  const menuItems = [
    { text: 'Registro', icon: <AddIcon />, selected: !showReportes && !showUsuarios },
    { text: 'Mis Reportes', icon: <BarChartIcon />, selected: showReportes },
    { text: 'Mapa', icon: <LocationIcon />, selected: false },
    { text: 'Estadísticas', icon: <AssessmentIcon />, selected: false },
  ];

  // Verificar si el usuario está cargando
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Verificar errores de autenticación
  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Sesión no válida</h3>
          <p className="text-gray-600 mb-4">Por favor, inicia sesión nuevamente</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ir al Login
          </button>
        </div>
      </div>
    );
  }

  const handleIncidentSubmit = (reportData) => {
    setLastReportData(reportData);
    setShowSuccessMessage(true);
    
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  // Drawer para navegación (igual que el Dashboard)
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
            Portal Ciudadano
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>
          Registro de Incidencias
        </Typography>
      </Box>

      {/* Información del usuario */}
      <Box sx={{ p: 2, borderBottom: `1px solid ${alpha('#fff', 0.1)}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: theme.palette.primary.main }}>
            {user?.nombre?.charAt(0) || 'U'}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {user?.nombreCompleto || `${user?.nombre} ${user?.apellido}`}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Ciudadano
            </Typography>
          </Box>
        </Box>
      </Box>

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
              if (item.text === 'Mis Reportes') {
                setShowReportes(true);
                setShowUsuarios(false);
              } else if (item.text === 'Registro') {
                setShowReportes(false);
                setShowUsuarios(false);
                setRegisterPanelOpen(true);
              } else {
                setShowReportes(false);
                setShowUsuarios(false);
              }
              if (isMobile) setMobileDrawerOpen(false);
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
          </ListItem>
        ))}
      </List>

      {/* Footer del drawer */}
      <Box sx={{ p: 2, borderTop: `1px solid ${alpha('#fff', 0.1)}` }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={handleGoHome}
          sx={{ mb: 1 }}
        >
          Volver al Inicio
        </Button>
        <Button
          fullWidth
          variant="text"
          onClick={logout}
          color="error"
        >
          Cerrar Sesión
        </Button>
      </Box>
    </Box>
  );

  const SuccessMessage = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-check-line text-3xl text-green-600"></i>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">¡Reporte Enviado Exitosamente!</h3>
        <p className="text-gray-600 mb-6">
          Tu reporte ha sido registrado y será revisado por las autoridades correspondientes.
        </p>
        <button
          onClick={() => setShowSuccessMessage(false)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Continuar
        </button>
      </div>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* AppBar superior */}
      {isMobile && (
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
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
              Portal Ciudadano
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => setRegisterPanelOpen(true)}
              sx={{ ml: 2 }}
            >
              Nuevo Reporte
            </Button>
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
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: isMobile ? '64px' : 0,
          minHeight: '100vh',
          bgcolor: 'background.default'
        }}
      >
        {/* Header del contenido */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          background: theme.palette.background.paper,
          p: 3,
          borderRadius: 2,
          boxShadow: '0 2px 10px rgba(13,17,23,0.08)'
        }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.text.primary, mb: 1 }}>
              {showReportes ? 'Mis Reportes' : 'Registro de Incidencias'}
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
              {showReportes ? 'Revisa el estado de tus reportes anteriores' : 'Reporta situaciones de seguridad en tu comunidad'}
            </Typography>
          </Box>
          
          {!isMobile && !showReportes && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setRegisterPanelOpen(true)}
              size="large"
              sx={{
                background: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                fontWeight: 'bold',
                px: 3,
                py: 1.5,
                boxShadow: '0 4px 14px rgba(45,108,223,0.15)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(45,108,223,0.25)',
                }
              }}
            >
              Nuevo Reporte
            </Button>
          )}
        </Box>

        {/* Contenido principal */}
        {showReportes ? (
          <Container maxWidth="lg">
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: theme.palette.text.primary }}>
              Mis Reportes Anteriores
            </Typography>
            {/* Aquí irían los reportes del usuario */}
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No tienes reportes registrados aún.
              </Typography>
            </Paper>
          </Container>
        ) : (
          <Container maxWidth="lg">
            {/* Panel principal de registro */}
            <Paper 
              elevation={3}
              sx={{ 
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(13,17,23,0.12)',
                background: theme.palette.background.paper
              }}
            >
              <Box sx={{ 
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: 'white',
                p: 3,
                textAlign: 'center'
              }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                  🚨 Registro de Incidencia
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Completa el formulario para reportar una situación de seguridad
                </Typography>
              </Box>
              
              <Box sx={{ p: 4 }}>
                <IncidentRegisterPanel 
                  open={true} 
                  onSubmit={handleIncidentSubmit}
                />
              </Box>
            </Paper>

            {/* Panel de ayuda */}
            <Paper 
              elevation={2}
              sx={{ 
                mt: 3,
                p: 3,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.success.light}15 0%, ${theme.palette.success.main}08 100%)`,
                border: `1px solid ${theme.palette.success.light}40`
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: '50%', 
                  background: theme.palette.success.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <LightbulbIcon sx={{ color: 'white', fontSize: 24 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.success.dark, mb: 2 }}>
                    Consejos para un Reporte Efectivo
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CheckCircleIcon sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                          Sé específico en la descripción
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CheckCircleIcon sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                          Incluye referencias de ubicación
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CheckCircleIcon sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                          Selecciona la ubicación en el mapa
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CheckCircleIcon sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                          Reporta solo hechos verificables
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Paper>
          </Container>
        )}
      </Box>

      {/* Dialog para registro de incidencia (móvil) */}
      <Dialog
        open={registerPanelOpen}
        onClose={() => setRegisterPanelOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 2,
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReportIcon />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Nuevo Reporte de Incidencia
            </Typography>
          </Box>
          <IconButton
            onClick={() => setRegisterPanelOpen(false)}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 3 }}>
            <IncidentRegisterPanel 
              open={true} 
              onSubmit={(data) => {
                handleIncidentSubmit(data);
                setRegisterPanelOpen(false);
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Mensaje de éxito */}
      {showSuccessMessage && <SuccessMessage />}
    </Box>
  );
};

export default Incidencia;