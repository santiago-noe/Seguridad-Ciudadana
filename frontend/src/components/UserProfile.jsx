import React, { useState, useEffect } from 'react';

const UserProfile = ({ isVisible, onClose, userData = null }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userStats, setUserStats] = useState({
    totalReports: 12,
    resolvedReports: 10,
    pendingReports: 2,
    communityRanking: 'Ciudadano Activo',
    joinDate: '2024-01-15',
    lastActivity: '2024-10-05'
  });

  const [recentReports] = useState([
    {
      id: 1,
      type: 'Robo',
      date: '2024-10-05',
      status: 'Resuelto',
      location: 'Av. Principal 123',
      priority: 'Alta'
    },
    {
      id: 2,
      type: 'Vandalismo',
      date: '2024-10-03',
      status: 'En proceso',
      location: 'Parque Central',
      priority: 'Media'
    },
    {
      id: 3,
      type: 'Iluminación',
      date: '2024-10-01',
      status: 'Resuelto',
      location: 'Calle Los Olivos',
      priority: 'Baja'
    }
  ]);

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    weeklyReport: true
  });

  const mockUser = {
    name: 'María González',
    email: 'maria.gonzalez@email.com',
    phone: '+51 987 654 321',
    address: 'San Isidro, Lima',
    avatar: null,
    memberSince: '2024-01-15'
  };

  const currentUser = userData || mockUser;

  if (!isVisible) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resuelto':
        return 'text-green-600 bg-green-100';
      case 'En proceso':
        return 'text-yellow-600 bg-yellow-100';
      case 'Pendiente':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Alta':
        return 'text-red-600 bg-red-100';
      case 'Media':
        return 'text-yellow-600 bg-yellow-100';
      case 'Baja':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const toggleNotification = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-all duration-200"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
          
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <i className="ri-user-line text-3xl"></i>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{currentUser.name}</h2>
              <p className="text-blue-100">{userStats.communityRanking}</p>
              <p className="text-blue-200 text-sm">Miembro desde {new Date(currentUser.memberSince).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{userStats.totalReports}</div>
              <div className="text-blue-200 text-sm">Reportes Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{userStats.resolvedReports}</div>
              <div className="text-blue-200 text-sm">Resueltos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.round((userStats.resolvedReports / userStats.totalReports) * 100)}%</div>
              <div className="text-blue-200 text-sm">Efectividad</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <i className="ri-dashboard-line mr-2"></i>
              Resumen
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'reports'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <i className="ri-file-list-line mr-2"></i>
              Mis Reportes
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <i className="ri-settings-line mr-2"></i>
              Configuración
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Activity Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">Reportes Resueltos</h3>
                      <p className="text-3xl font-bold text-green-600">{userStats.resolvedReports}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center">
                      <i className="ri-check-line text-2xl text-green-600"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-yellow-800">En Proceso</h3>
                      <p className="text-3xl font-bold text-yellow-600">{userStats.pendingReports}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-yellow-200 flex items-center justify-center">
                      <i className="ri-time-line text-2xl text-yellow-600"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Actividad Reciente</h3>
                <div className="space-y-3">
                  {recentReports.slice(0, 3).map((report) => (
                    <div key={report.id} className="flex items-center justify-between bg-white rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <div>
                          <p className="font-medium text-gray-800">{report.type}</p>
                          <p className="text-sm text-gray-500">{report.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">{report.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Impact */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Impacto en la Comunidad</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">+15</div>
                    <div className="text-blue-700 text-sm">Puntos de Seguridad</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">#3</div>
                    <div className="text-blue-700 text-sm">Ranking Local</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Historial de Reportes</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <i className="ri-add-line mr-2"></i>
                  Nuevo Reporte
                </button>
              </div>

              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div key={report.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-800">{report.type}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(report.priority)}`}>
                            {report.priority}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-1">
                          <i className="ri-map-pin-line mr-1"></i>
                          {report.location}
                        </p>
                        <p className="text-gray-500 text-sm">
                          <i className="ri-calendar-line mr-1"></i>
                          {report.date}
                        </p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <i className="ri-more-2-line text-xl"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Personal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input 
                      type="text" 
                      value={currentUser.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      value={currentUser.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input 
                      type="tel" 
                      value={currentUser.phone}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                    <input 
                      type="text" 
                      value={currentUser.address}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Configuración de Notificaciones</h3>
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">
                          {key === 'emailAlerts' && 'Alertas por Email'}
                          {key === 'smsAlerts' && 'Alertas por SMS'}
                          {key === 'pushNotifications' && 'Notificaciones Push'}
                          {key === 'weeklyReport' && 'Reporte Semanal'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {key === 'emailAlerts' && 'Recibir notificaciones por correo electrónico'}
                          {key === 'smsAlerts' && 'Recibir alertas importantes por SMS'}
                          {key === 'pushNotifications' && 'Notificaciones en tiempo real'}
                          {key === 'weeklyReport' && 'Resumen semanal de actividad'}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleNotification(key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Guardar Cambios
                </button>
                <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;