
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

// Configurar axios para el backend
axios.defaults.baseURL = 'http://127.0.0.1:4000';

const Login = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Usar el contexto de autenticación

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const res = await axios.post('/api/login', { email, password });
      
      if (res.data.success && res.data.user) {
        // Usar la función login del contexto
        await login(email, password);
        
        // Guardar información adicional en localStorage
        localStorage.setItem('userType', res.data.user.tipo);
        localStorage.setItem('userRol', res.data.user.rol || res.data.user.tipo);
        
        if (onLoginSuccess) onLoginSuccess(res.data);
        
        console.log('Login response:', res.data); // Debug
        console.log('User data:', res.data.user); // Debug
        console.log('User type saved:', res.data.user.tipo); // Debug
        
        // Redirigir según el tipo de usuario
        if (res.data.user.tipo === 'personal' || res.data.user.rol === 'admin' || res.data.user.cargo === 'Administrador') {
          console.log('Redirecting to dashboard...'); // Debug
          navigate('/dashboard');
        } else {
          console.log('Redirecting to incidencia...'); // Debug
          navigate('/incidencia');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold" style={{color: '#121420'}}>Iniciar Sesión</h2>
        <p style={{color: '#403f4c'}}>Accede a tu cuenta de Seguridad Ciudadana</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div className="relative group">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="peer w-full h-14 px-4 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 placeholder-transparent text-gray-900"
            style={{'--tw-ring-color': '#403f4c'}}
            placeholder="Correo electrónico"
          />
          <label
            htmlFor="email"
            className="absolute left-12 top-4 text-gray-500 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-gray-50 peer-focus:px-2 peer-focus:rounded peer-[&:not(:placeholder-shown)]:top-1 peer-[&:not(:placeholder-shown)]:left-3 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:bg-gray-50 peer-[&:not(:placeholder-shown)]:px-2 peer-[&:not(:placeholder-shown)]:rounded"
            style={{'--focus-color': '#3c6e71'}}
          >
            Correo electrónico
          </label>
          <i className="ri-mail-line absolute left-4 top-4 text-gray-400 group-focus-within:text-gray-600 transition-colors duration-300" style={{'--focus-color': '#3c6e71'}}></i>
        </div>

        {/* Password Input */}
        <div className="relative group">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="peer w-full h-14 px-4 pl-12 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 placeholder-transparent text-gray-900"
            style={{'--tw-ring-color': '#403f4c'}}
            placeholder="Contraseña"
          />
          <label
            htmlFor="password"
            className="absolute left-12 top-4 text-gray-500 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-gray-50 peer-focus:px-2 peer-focus:rounded peer-[&:not(:placeholder-shown)]:top-1 peer-[&:not(:placeholder-shown)]:left-3 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:bg-gray-50 peer-[&:not(:placeholder-shown)]:px-2 peer-[&:not(:placeholder-shown)]:rounded"
          >
            Contraseña
          </label>
          <i className="ri-lock-line absolute left-4 top-4 text-gray-400 group-focus-within:text-gray-600 transition-colors duration-300"></i>
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-4 top-4 text-gray-400 transition-colors duration-300 focus:outline-none"
            style={{'--hover-color': '#3c6e71'}}
          >
            <i className={showPassword ? 'ri-eye-line' : 'ri-eye-off-line'}></i>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-fade-in">
            <div className="flex items-center space-x-2">
              <i className="ri-error-warning-line text-red-500 flex-shrink-0"></i>
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
          style={{background: 'linear-gradient(135deg, #403f4c, #5a6069)'}}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Iniciando sesión...</span>
            </div>
          ) : (
            'Iniciar Sesión'
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="text-center pt-4">
        <p style={{color: '#403f4c'}}>
          ¿No tienes una cuenta?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-semibold transition-colors duration-300 focus:outline-none"
            style={{color: '#403f4c'}}
          >
            Crear Cuenta
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
