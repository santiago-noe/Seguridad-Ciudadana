import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const IncidentCharts = ({ incidents = [] }) => {
  // Procesar datos para gráficos
  const processDataForCharts = () => {
    if (!incidents || incidents.length === 0) {
      return {
        categoryData: [],
        statusData: [],
        monthlyData: [],
        typeData: []
      };
    }

    // Datos por categoría (Falta vs Delito)
    const categoryCount = incidents.reduce((acc, inc) => {
      const category = inc.categoria || 'General';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const categoryData = Object.entries(categoryCount).map(([name, value]) => ({
      name,
      value,
      color: name === 'Delito' ? '#e53e3e' : name === 'Falta' ? '#fd7f28' : '#4299e1'
    }));

    // Datos por estado
    const statusCount = incidents.reduce((acc, inc) => {
      const status = inc.estado || 'pendiente';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const statusData = Object.entries(statusCount).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: name === 'resuelto' ? '#38a169' : name === 'en_proceso' ? '#fd7f28' : '#e53e3e'
    }));

    // Datos por tipo específico
    const typeCount = incidents.reduce((acc, inc) => {
      const type = inc.tipo || 'Sin especificar';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const typeData = Object.entries(typeCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8) // Top 8 tipos
      .map(([name, count]) => ({
        name: name.length > 20 ? name.substring(0, 17) + '...' : name,
        count
      }));

    // Datos mensuales
    const monthlyCount = incidents.reduce((acc, inc) => {
      const date = new Date(inc.fecha_reporte);
      if (!isNaN(date)) {
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        acc[monthYear] = (acc[monthYear] || 0) + 1;
      }
      return acc;
    }, {});

    const monthlyData = Object.entries(monthlyCount)
      .sort(([a], [b]) => {
        const [monthA, yearA] = a.split('/').map(Number);
        const [monthB, yearB] = b.split('/').map(Number);
        return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
      })
      .map(([month, count]) => ({
        month,
        count
      }));

    return {
      categoryData,
      statusData,
      monthlyData,
      typeData
    };
  };

  const { categoryData, statusData, monthlyData, typeData } = processDataForCharts();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: false,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return `${context.label}: ${context.raw} (${percentage}%)`;
          }
        }
      }
    },
  };

  if (incidents.length === 0) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Estadísticas de Incidencias
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: 200,
            color: '#666' 
          }}>
            No hay datos disponibles para mostrar estadísticas
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Estadísticas de Incidencias ({incidents.length} registros)
        </Typography>
        
        <Grid container spacing={3}>
          {/* Gráfico de categorías (Pie) */}
          <Grid item xs={12} md={6}>
            <Box sx={{ height: 300 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, textAlign: 'center' }}>
                Distribución por Categoría
              </Typography>
              <Box sx={{ height: 250 }}>
                <Pie
                  data={{
                    labels: categoryData.map(item => item.name),
                    datasets: [{
                      data: categoryData.map(item => item.value),
                      backgroundColor: categoryData.map(item => item.color),
                      borderWidth: 2,
                      borderColor: '#fff'
                    }]
                  }}
                  options={pieOptions}
                />
              </Box>
            </Box>
          </Grid>

          {/* Gráfico de estados (Pie) */}
          <Grid item xs={12} md={6}>
            <Box sx={{ height: 300 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, textAlign: 'center' }}>
                Estado de Incidencias
              </Typography>
              <Box sx={{ height: 250 }}>
                <Pie
                  data={{
                    labels: statusData.map(item => item.name),
                    datasets: [{
                      data: statusData.map(item => item.value),
                      backgroundColor: statusData.map(item => item.color),
                      borderWidth: 2,
                      borderColor: '#fff'
                    }]
                  }}
                  options={pieOptions}
                />
              </Box>
            </Box>
          </Grid>

          {/* Gráfico de tipos más frecuentes (Bar) */}
          {typeData.length > 0 && (
            <Grid item xs={12} md={6}>
              <Box sx={{ height: 300 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, textAlign: 'center' }}>
                  Tipos Más Frecuentes
                </Typography>
                <Box sx={{ height: 250 }}>
                  <Bar
                    data={{
                      labels: typeData.map(item => item.name),
                      datasets: [{
                        label: 'Cantidad',
                        data: typeData.map(item => item.count),
                        backgroundColor: '#4299e1',
                        borderColor: '#2b6cb0',
                        borderWidth: 1
                      }]
                    }}
                    options={{
                      ...chartOptions,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </Box>
            </Grid>
          )}

          {/* Gráfico de tendencia mensual (Line) */}
          {monthlyData.length > 0 && (
            <Grid item xs={12} md={6}>
              <Box sx={{ height: 300 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, textAlign: 'center' }}>
                  Tendencia Mensual
                </Typography>
                <Box sx={{ height: 250 }}>
                  <Line
                    data={{
                      labels: monthlyData.map(item => item.month),
                      datasets: [{
                        label: 'Incidencias por Mes',
                        data: monthlyData.map(item => item.count),
                        borderColor: '#38a169',
                        backgroundColor: 'rgba(56, 161, 105, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                      }]
                    }}
                    options={{
                      ...chartOptions,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default IncidentCharts;