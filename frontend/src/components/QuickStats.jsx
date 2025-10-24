import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const QuickStats = ({ className = '', showGlobal = false }) => {
  const [stats, setStats] = useState({
    total_reportes: 0,
    resueltos: 0,
    en_proceso: 0,
    pendientes: 0,
    efectividad: 0,
    usuarios_activos: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const loadStats = async () => {
      if (!isAuthenticated()) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        let response;
        
        if (showGlobal) {
          // Cargar estadísticas globales del sistema
          response = await axios.get('/api/estadisticas/globales');
        } else {
          // Cargar estadísticas del usuario actual
          if (user && user.id) {
            response = await axios.get(`/api/usuarios/${user.id}/estadisticas`);
          } else {
            throw new Error('Usuario no válido');
          }
        }
        
        if (response.data && response.data.success) {
          setStats(response.data.estadisticas);
        } else {
          throw new Error('Respuesta inválida del servidor');
        }
      } catch (err) {
        console.error('Error al cargar estadísticas:', err);
        setError('Error al cargar estadísticas');
        // Usar valores por defecto en caso de error
        setStats({
          total_reportes: 0,
          resueltos: 0,
          en_proceso: 0,
          pendientes: 0,
          efectividad: 0,
          usuarios_activos: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [user, isAuthenticated, showGlobal]);

  const StatCard = ({ icon, value, label, color = 'blue', trend = null, isPercentage = false }) => (
    <div className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-2xl font-bold text-${color}-600`}>
            {isLoading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            ) : (
              <>
                {typeof value === 'number' ? value.toLocaleString() : value}
                {isPercentage && '%'}
              </>
            )}
          </div>
          <div className="text-sm text-gray-600 mt-1">{label}</div>
          {trend && !isLoading && (
            <div className={`text-xs flex items-center mt-1 ${
              trend.type === 'up' ? 'text-green-600' : 
              trend.type === 'down' ? 'text-red-600' : 'text-gray-500'
            }`}>
              <i className={`ri-arrow-${trend.type === 'up' ? 'up' : trend.type === 'down' ? 'down' : 'right'}-line mr-1`}></i>
              {trend.value}
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-full bg-${color}-100 flex items-center justify-center`}>
          <i className={`${icon} text-xl text-${color}-600`}></i>
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <i className="ri-error-warning-line text-red-600 mr-2"></i>
          <span className="text-red-800">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon="ri-file-list-line"
        value={stats.total_reportes}
        label={showGlobal ? "Total Incidencias" : "Mis Reportes"}
        color="blue"
        trend={stats.total_reportes > 0 ? { type: 'up', value: 'Activo' } : null}
      />
      
      <StatCard
        icon="ri-check-line"
        value={stats.resueltos}
        label="Resueltos"
        color="green"
        trend={stats.resueltos > 0 ? { 
          type: 'up', 
          value: `${Math.round((stats.resueltos / Math.max(stats.total_reportes, 1)) * 100)}% del total` 
        } : null}
      />
      
      <StatCard
        icon="ri-time-line"
        value={stats.en_proceso}
        label="En Proceso"
        color="yellow"
        trend={stats.en_proceso > 0 ? { type: 'right', value: 'En progreso' } : null}
      />
      
      <StatCard
        icon="ri-speed-line"
        value={stats.efectividad}
        label="Efectividad"
        color="purple"
        isPercentage={true}
        trend={stats.efectividad >= 70 ? 
          { type: 'up', value: 'Excelente' } : 
          stats.efectividad >= 50 ? 
          { type: 'right', value: 'Bueno' } : 
          { type: 'down', value: 'Mejorable' }
        }
      />
      
      {showGlobal && (
        <div className="col-span-2 lg:col-span-4">
          <StatCard
            icon="ri-group-line"
            value={stats.usuarios_activos}
            label="Usuarios Activos"
            color="indigo"
            trend={{ type: 'up', value: 'Creciendo' }}
          />
        </div>
      )}
    </div>
  );
};

export default QuickStats;