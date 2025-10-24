import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Login from './Login';
import Register from './Register';

const AuthContainer = ({ onLoginSuccess, onRegisterSuccess }) => {
  const location = useLocation();
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Detectar la ruta actual para mostrar Login o Register
  useEffect(() => {
    setIsRegisterMode(location.pathname === '/register');
  }, [location.pathname]);

  const switchToRegister = () => {
    setIsRegisterMode(true);
    window.history.pushState(null, '', '/register');
  };

  const switchToLogin = () => {
    setIsRegisterMode(false);
    window.history.pushState(null, '', '/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-0 min-h-[480px] bg-white rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Hero Section - Solo visible en desktop */}
          <div className="hidden lg:flex flex-col justify-center items-center p-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-sm"></div>
              <div className="absolute top-40 right-20 w-24 h-24 bg-white rounded-full blur-sm"></div>
              <div className="absolute bottom-20 left-20 w-40 h-40 bg-white rounded-full blur-sm"></div>
              <div className="absolute bottom-10 right-10 w-28 h-28 bg-white rounded-full blur-sm"></div>
            </div>
            
            <div className="relative z-10 text-center max-w-lg">
              <div className={`transition-all duration-700 ease-in-out ${isRegisterMode ? 'animate-fade-in' : 'animate-fade-in'}`}>
                {/* Logo/Icon */}
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <i className="ri-shield-check-line text-2xl text-white"></i>
                  </div>
                </div>
                
                <h1 className="text-2xl lg:text-3xl font-bold mb-4 leading-tight">
                  <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    {isRegisterMode ? 'Únete a Nosotros' : 'Bienvenido de Vuelta'}
                  </span>
                </h1>
                
                <p className="text-base text-blue-100 leading-relaxed mb-5">
                  {isRegisterMode 
                    ? 'Crea tu cuenta y forma parte de nuestra comunidad comprometida con la seguridad ciudadana. Juntos construimos un futuro más seguro.'
                    : 'Tu seguridad es nuestra prioridad. Accede a tu cuenta y mantente conectado con tu comunidad.'
                  }
                </p>
                
                {/* Features */}
                <div className="flex justify-center space-x-4 text-blue-200">
                  <div className="text-center">
                    <i className="ri-shield-check-line text-xl mb-1 block"></i>
                    <span className="text-xs">Seguro</span>
                  </div>
                  <div className="text-center">
                    <i className="ri-community-line text-xl mb-1 block"></i>
                    <span className="text-xs">Comunidad</span>
                  </div>
                  <div className="text-center">
                    <i className="ri-24-hours-line text-xl mb-1 block"></i>
                    <span className="text-xs">24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="flex items-center justify-center p-5 lg:p-8">
            <div className="w-full max-w-sm">
              <div className={`transition-all duration-500 ease-in-out ${isRegisterMode ? 'animate-fade-in' : 'animate-fade-in'}`}>
                {!isRegisterMode ? (
                  <Login 
                    onLoginSuccess={onLoginSuccess}
                    onSwitchToRegister={switchToRegister}
                  />
                ) : (
                  <Register 
                    onRegisterSuccess={() => {
                      if (onRegisterSuccess) onRegisterSuccess();
                      switchToLogin();
                    }}
                    onSwitchToLogin={switchToLogin}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;