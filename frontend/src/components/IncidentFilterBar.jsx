import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';

const IncidentFilterBar = ({ filters, setFilters, onReset }) => {
  const handleChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFilters({
      q: '',
      tipo: '',
      estado: '',
      desde: '',
      hasta: ''
    });
    if (onReset) onReset();
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 2, 
      mb: 3, 
      flexWrap: 'wrap',
      background: 'rgba(255,255,255,0.05)',
      p: 2,
      borderRadius: 2,
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      <TextField
        label="Buscar"
        value={filters?.q || ''}
        onChange={(e) => handleChange('q', e.target.value)}
        size="small"
        sx={{ minWidth: 200 }}
        placeholder="Buscar en descripción o ubicación..."
      />
      
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Tipo</InputLabel>
        <Select
          value={filters?.tipo || ''}
          onChange={(e) => handleChange('tipo', e.target.value)}
          label="Tipo"
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="Falta">Falta</MenuItem>
          <MenuItem value="Delito">Delito</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Estado</InputLabel>
        <Select
          value={filters?.estado || ''}
          onChange={(e) => handleChange('estado', e.target.value)}
          label="Estado"
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="pendiente">Pendiente</MenuItem>
          <MenuItem value="en_proceso">En Proceso</MenuItem>
          <MenuItem value="resuelto">Resuelto</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Desde"
        type="date"
        value={filters?.desde || ''}
        onChange={(e) => handleChange('desde', e.target.value)}
        size="small"
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        label="Hasta"
        type="date"
        value={filters?.hasta || ''}
        onChange={(e) => handleChange('hasta', e.target.value)}
        size="small"
        InputLabelProps={{ shrink: true }}
      />

      <Button 
        variant="outlined" 
        onClick={handleReset}
        size="small"
        sx={{ minHeight: '40px' }}
      >
        Limpiar
      </Button>
    </Box>
  );
};

export default IncidentFilterBar;