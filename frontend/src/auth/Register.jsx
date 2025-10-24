

import React, { useState } from 'react';
import { auth } from './firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import axios from 'axios';

// Configurar axios para el backend
axios.defaults.baseURL = 'http://127.0.0.1:4000';

const Register = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    telefono: '',
    dni: '',
    rol: 'ciudadano',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [verificado, setVerificado] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await sendEmailVerification(userCredential.user);
      setFirebaseUser(userCredential.user);
      setSuccess('Registro exitoso. Revisa tu correo y haz clic en el enlace de verificación.');
      setError('');
      setOpenModal(true);
    } catch (err) {
      setError(err.message || 'Error al registrar usuario');
      setSuccess('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificarCorreo = async () => {
    setError('');
    setSuccess('');
    try {
      await firebaseUser.reload();
      if (firebaseUser.emailVerified) {
        setVerificado(true);
        const payload = { ...form, firebase_uid: firebaseUser.uid };
        await axios.post('/api/register', payload);
        setSuccess('¡Registro completo! Ya puedes iniciar sesión.');
        setError('');
        setOpenModal(false);
        if (onRegisterSuccess) onRegisterSuccess();
      } else {
        setError('Tu correo aún no ha sido verificado. Por favor revisa tu bandeja de entrada.');
      }
    } catch (err) {
      setError(err.message || 'Error al verificar correo');
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold" style={{color: '#121420'}}>Crear Cuenta</h2>
          <p style={{color: '#403f4c'}}>Únete a la comunidad de Seguridad Ciudadana</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative group">
              <input
                type="text"
                name="nombres"
                id="nombres"
                value={form.nombres}
                onChange={handleChange}
                required
                className="peer w-full h-14 px-4 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 placeholder-transparent text-gray-900"
                style={{'--tw-ring-color': '#3c6e71'}}
                placeholder="Nombres"
              />
              <label
                htmlFor="nombres"
                className="absolute left-12 top-4 text-gray-500 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-gray-50 peer-focus:px-2 peer-focus:rounded peer-[&:not(:placeholder-shown)]:top-1 peer-[&:not(:placeholder-shown)]:left-3 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:bg-gray-50 peer-[&:not(:placeholder-shown)]:px-2 peer-[&:not(:placeholder-shown)]:rounded"
                style={{'--focus-color': '#3c6e71'}}
              >
                Nombres
              </label>
              <i className="ri-user-line absolute left-4 top-4 text-gray-400 group-focus-within:text-gray-600 transition-colors duration-300"></i>
            </div>

            <div className="relative group">
              <input
                type="text"
                name="apellidos"
                id="apellidos"
                value={form.apellidos}
                onChange={handleChange}
                required
                className="peer w-full h-14 px-4 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 placeholder-transparent text-gray-900"
                style={{'--tw-ring-color': '#3c6e71'}}
                placeholder="Apellidos"
              />
              <label
                htmlFor="apellidos"
                className="absolute left-12 top-4 text-gray-500 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-gray-50 peer-focus:px-2 peer-focus:rounded peer-[&:not(:placeholder-shown)]:top-1 peer-[&:not(:placeholder-shown)]:left-3 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:bg-gray-50 peer-[&:not(:placeholder-shown)]:px-2 peer-[&:not(:placeholder-shown)]:rounded"
              >
                Apellidos
              </label>
              <i className="ri-user-line absolute left-4 top-4 text-gray-400 group-focus-within:text-gray-600 transition-colors duration-300"></i>
            </div>
          </div>

          {/* Teléfono y DNI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative group">
              <input
                type="text"
                name="telefono"
                id="telefono"
                value={form.telefono}
                onChange={handleChange}
                className="peer w-full h-14 px-4 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 placeholder-transparent text-gray-900"
                style={{'--tw-ring-color': '#3c6e71'}}
                placeholder="Teléfono"
              />
              <label
                htmlFor="telefono"
                className="absolute left-12 top-4 text-gray-500 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-gray-50 peer-focus:px-2 peer-focus:rounded peer-[&:not(:placeholder-shown)]:top-1 peer-[&:not(:placeholder-shown)]:left-3 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:bg-gray-50 peer-[&:not(:placeholder-shown)]:px-2 peer-[&:not(:placeholder-shown)]:rounded"
              >
                Teléfono
              </label>
              <i className="ri-phone-line absolute left-4 top-4 text-gray-400 group-focus-within:text-gray-600 transition-colors duration-300"></i>
            </div>

            <div className="relative group">
              <input
                type="text"
                name="dni"
                id="dni"
                value={form.dni}
                onChange={handleChange}
                className="peer w-full h-14 px-4 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 placeholder-transparent text-gray-900"
                style={{'--tw-ring-color': '#403f4c'}}
                placeholder="DNI"
              />
              <label
                htmlFor="dni"
                className="absolute left-12 top-4 text-gray-500 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-gray-50 peer-focus:px-2 peer-focus:rounded peer-[&:not(:placeholder-shown)]:top-1 peer-[&:not(:placeholder-shown)]:left-3 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:bg-gray-50 peer-[&:not(:placeholder-shown)]:px-2 peer-[&:not(:placeholder-shown)]:rounded"
              >
                DNI
              </label>
              <i className="ri-id-card-line absolute left-4 top-4 text-gray-400 group-focus-within:text-gray-600 transition-colors duration-300"></i>
            </div>
          </div>

          {/* Email */}
          <div className="relative group">
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              required
              className="peer w-full h-14 px-4 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 placeholder-transparent text-gray-900"
              style={{'--tw-ring-color': '#403f4c'}}
              placeholder="Correo electrónico"
            />
            <label
              htmlFor="email"
              className="absolute left-12 top-4 text-gray-500 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-gray-50 peer-focus:px-2 peer-focus:rounded peer-[&:not(:placeholder-shown)]:top-1 peer-[&:not(:placeholder-shown)]:left-3 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:bg-gray-50 peer-[&:not(:placeholder-shown)]:px-2 peer-[&:not(:placeholder-shown)]:rounded"
            >
              Correo electrónico
            </label>
            <i className="ri-mail-line absolute left-4 top-4 text-gray-400 group-focus-within:text-gray-600 transition-colors duration-300"></i>
          </div>

          {/* Password */}
          <div className="relative group">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
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
            >
              <i className={showPassword ? 'ri-eye-line' : 'ri-eye-off-line'}></i>
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-fade-in">
              <div className="flex items-center space-x-2">
                <i className="ri-error-warning-line text-red-500 flex-shrink-0"></i>
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 animate-fade-in">
              <div className="flex items-center space-x-2">
                <i className="ri-check-line text-green-500 flex-shrink-0"></i>
                <span className="text-green-700 text-sm">{success}</span>
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
                <span>Creando cuenta...</span>
              </div>
            ) : (
              'Crear Cuenta'
            )}
          </button>
        </form>

        {/* Switch to Login */}
        <div className="text-center pt-4">
          <p style={{color: '#403f4c'}}>
            ¿Ya tienes una cuenta?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-semibold transition-colors duration-300 focus:outline-none"
              style={{color: '#403f4c'}}
            >
              Iniciar Sesión
            </button>
          </p>
        </div>
      </div>

      {/* Modal de verificación */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform animate-fade-in">
            <div className="text-center space-y-6">
              {/* Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100">
                <i className="ri-mail-send-line text-indigo-600 text-2xl"></i>
              </div>
              
              {/* Title */}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-800">Verificar correo electrónico</h3>
                <p className="text-gray-600 leading-relaxed">
                  Revisa tu correo y haz clic en el enlace de verificación. Luego presiona el botón para completar tu registro.
                </p>
              </div>
              
              {/* Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2">
                    <i className="ri-error-warning-line text-red-500 flex-shrink-0"></i>
                    <span className="text-red-700 text-sm">{error}</span>
                  </div>
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2">
                    <i className="ri-check-line text-green-500 flex-shrink-0"></i>
                    <span className="text-green-700 text-sm">{success}</span>
                  </div>
                </div>
              )}
              
              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleVerificarCorreo}
                  className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Ya verifiqué mi correo
                </button>
                <button
                  onClick={() => setOpenModal(false)}
                  className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
