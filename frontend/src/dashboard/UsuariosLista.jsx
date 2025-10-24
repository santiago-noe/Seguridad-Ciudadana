import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { TextField, Box, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip } from '@mui/material';
import axios from 'axios';

// Configurar axios
axios.defaults.baseURL = 'http://127.0.0.1:4000';

// Configurar axios con la URL base del backend
const api = axios.create({
  baseURL: 'http://127.0.0.1:4000'
});

const UsuariosLista = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [personal, setPersonal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewType, setViewType] = useState('todos'); // 'todos', 'ciudadanos', 'personal'

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usuariosRes, personalRes] = await Promise.all([
        api.get('/api/usuarios'),
        api.get('/api/personal')
      ]);
      
      console.log('Usuarios:', usuariosRes.data);
      console.log('Personal:', personalRes.data);
      
      const todosUsuarios = usuariosRes.data.usuarios || usuariosRes.data || [];
      const todoPersonal = personalRes.data.personal || personalRes.data || [];
      
      // Filtrar ciudadanos que NO están en Personal (evitar duplicados)
      const soloPersonal = todoPersonal.map(p => p.dni || p.email);
      const ciudadanosSinPersonal = todosUsuarios.filter(u => 
        !soloPersonal.includes(u.dni) && !soloPersonal.includes(u.email)
      );
      
      setUsuarios(ciudadanosSinPersonal);
      setPersonal(todoPersonal);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Combinar datos para vista completa
  const allUsers = [
    ...usuarios.map(u => ({ 
      ...u, 
      tipo: 'Ciudadano', 
      cargo: 'N/A', 
      rol: 'Ciudadano',
      key: `ciudadano-${u.dni || u.id}`
    })),
    ...personal.map(p => ({ 
      ...p, 
      tipo: 'Personal', 
      cargo: p.cargo || 'N/A', 
      rol: p.rol || 'N/A',
      key: `personal-${p.dni || p.id}`
    }))
  ];

  // Filtrar según el tipo de vista
  let filteredData = allUsers;
  if (viewType === 'ciudadanos') {
    filteredData = usuarios.map(u => ({ 
      ...u, 
      tipo: 'Ciudadano', 
      cargo: 'N/A', 
      rol: 'Ciudadano',
      key: `ciudadano-${u.dni || u.id}`
    }));
  } else if (viewType === 'personal') {
    filteredData = personal.map(p => ({ 
      ...p, 
      tipo: 'Personal', 
      cargo: p.cargo || 'N/A', 
      rol: p.rol || 'N/A',
      key: `personal-${p.dni || p.id}`
    }));
  }

  // Aplicar filtro de búsqueda
  const filteredUsers = filteredData.filter(u =>
    u.nombres?.toLowerCase().includes(search.toLowerCase()) ||
    u.apellidos?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.tipo?.toLowerCase().includes(search.toLowerCase()) ||
    u.cargo?.toLowerCase().includes(search.toLowerCase()) ||
    u.rol?.toLowerCase().includes(search.toLowerCase())
  );

  const getChipColor = (tipo) => {
    switch (tipo) {
      case 'Personal': return 'primary';
      case 'Ciudadano': return 'secondary';
      default: return 'default';
    }
  };

  const getRolColor = (rol) => {
    switch (rol?.toLowerCase()) {
      case 'admin': return 'error';
      case 'supervisor': return 'warning';
      case 'operador': return 'info';
      case 'ciudadano': return 'success';
      default: return 'default';
    }
  };

  const theme = useTheme();
  return (
    <Card sx={{ mb: 4, background: theme.palette.background.paper, color: theme.palette.text.primary, borderRadius: 3, boxShadow: '0 4px 20px rgba(13,17,23,0.15)', border: `1px solid ${theme.palette.divider}` }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.primary }}>
          Gestión de Usuarios y Personal
        </Typography>
        
        {/* Controles de filtrado */}
        <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Buscar usuario"
            variant="outlined"
            size="small"
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ 
              minWidth: 250,
              background: theme.palette.background.default, 
              borderRadius: 1, 
              color: theme.palette.text.primary 
            }}
            InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
            InputProps={{ style: { color: theme.palette.text.primary } }}
          />
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel style={{ color: theme.palette.text.secondary }}>Filtrar por</InputLabel>
            <Select
              value={viewType}
              onChange={e => setViewType(e.target.value)}
              label="Filtrar por"
              sx={{ 
                background: theme.palette.background.default,
                color: theme.palette.text.primary 
              }}
            >
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="ciudadanos">Solo Ciudadanos</MenuItem>
              <MenuItem value="personal">Solo Personal</MenuItem>
            </Select>
          </FormControl>

          <Button 
            variant="outlined" 
            onClick={loadData}
            sx={{ color: theme.palette.text.primary, borderColor: theme.palette.divider }}
          >
            Actualizar
          </Button>
        </Box>

        {/* Estadísticas rápidas */}
        <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip 
            label={`Total: ${filteredUsers.length}`} 
            color="default" 
            variant="outlined" 
          />
          <Chip 
            label={`Ciudadanos: ${usuarios.length}`} 
            color="secondary" 
            variant="outlined" 
          />
          <Chip 
            label={`Personal: ${personal.length}`} 
            color="primary" 
            variant="outlined" 
          />
        </Box>

        {loading ? (
          <Typography sx={{ color: theme.palette.text.primary }}>Cargando...</Typography>
        ) : (
          <Table sx={{ background: 'transparent', color: theme.palette.text.primary }}>
            <TableHead>
              <TableRow>
                <TableCell style={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Tipo</TableCell>
                <TableCell style={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Nombres</TableCell>
                <TableCell style={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Apellidos</TableCell>
                <TableCell style={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Email</TableCell>
                <TableCell style={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Teléfono</TableCell>
                <TableCell style={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>DNI</TableCell>
                <TableCell style={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Cargo</TableCell>
                <TableCell style={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Rol</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map(u => (
                <TableRow key={u.key}>
                  <TableCell>
                    <Chip 
                      label={u.tipo} 
                      color={getChipColor(u.tipo)} 
                      size="small"
                      variant="filled"
                    />
                  </TableCell>
                  <TableCell style={{ color: theme.palette.text.primary }}>{u.nombres}</TableCell>
                  <TableCell style={{ color: theme.palette.text.primary }}>{u.apellidos}</TableCell>
                  <TableCell style={{ color: theme.palette.text.primary }}>{u.email}</TableCell>
                  <TableCell style={{ color: theme.palette.text.primary }}>{u.telefono || u.num_telefono1 || 'N/A'}</TableCell>
                  <TableCell style={{ color: theme.palette.text.primary }}>{u.dni || 'N/A'}</TableCell>
                  <TableCell style={{ color: theme.palette.text.primary }}>{u.cargo}</TableCell>
                  <TableCell>
                    <Chip 
                      label={u.rol} 
                      color={getRolColor(u.rol)} 
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} style={{ textAlign: 'center', color: theme.palette.text.secondary }}>
                    No se encontraron usuarios
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default UsuariosLista;
