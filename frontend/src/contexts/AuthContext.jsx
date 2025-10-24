import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configurar axios para el backend
axios.defaults.baseURL = 'http://127.0.0.1:4000';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar datos del usuario desde localStorage o API
  const loadUserData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Primero intentar cargar desde localStorage
      const savedUser = localStorage.getItem('userData');
      const userEmail = localStorage.getItem('userEmail');
      
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          // Verificar que los datos sean válidos
          if (userData && userData.email && (userData.nombres || userData.nombre) && (userData.apellidos || userData.apellido)) {
            if (userData.nombres && userData.apellidos) {
              userData.nombreCompleto = `${userData.nombres} ${userData.apellidos}`;
            } else if (userData.nombre && userData.apellido) {
              userData.nombreCompleto = `${userData.nombre} ${userData.apellido}`;
            }
            setUser(userData);
            setLoading(false);
            return userData;
          }
        } catch (parseError) {
          console.error('Error al parsear datos guardados:', parseError);
          // Limpiar datos corruptos
          localStorage.removeItem('userData');
        }
      }
      
      // Si no hay datos guardados válidos pero hay email, obtener del servidor
      if (userEmail) {
        try {
          const response = await axios.get(`/api/usuarios/email/${userEmail}`);
          if (response.data && response.data.user) {
            const userData = response.data.user;
            userData.nombreCompleto = `${userData.nombre} ${userData.apellido}`;
            setUser(userData);
            localStorage.setItem('userData', JSON.stringify(userData));
            setLoading(false);
            return userData;
          }
        } catch (apiError) {
          console.error('Error al obtener usuario del servidor:', apiError);
          // Si el servidor no responde, limpiar datos locales
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userRol');
          localStorage.removeItem('userData');
        }
      }
      
      // No hay usuario autenticado
      setUser(null);
      setLoading(false);
      return null;
    } catch (err) {
      console.error('Error al cargar datos del usuario:', err);
      setError('Error al cargar datos del usuario');
      setUser(null);
      setLoading(false);
      return null;
    }
  };

  // Función para login
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/login', { email, password });
      
      if (response.data.success && response.data.user) {
        const userData = response.data.user;
        
        // Combinar nombre y apellido para mostrar nombre completo
        if (userData.nombres && userData.apellidos) {
          userData.nombreCompleto = `${userData.nombres} ${userData.apellidos}`;
        } else if (userData.nombre && userData.apellido) {
          userData.nombreCompleto = `${userData.nombre} ${userData.apellido}`;
        }
        
        setUser(userData);
        
        // Guardar en localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('userEmail', userData.email);
        localStorage.setItem('userRol', userData.rol);
        
        setLoading(false);
        return { success: true, user: userData };
      } else {
        throw new Error('Respuesta de login inválida');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
      setLoading(false);
      return { success: false, error: err.response?.data?.error || 'Error al iniciar sesión' };
    }
  };

  // Función para logout
  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRol');
    localStorage.removeItem('userType');
  };

  // Función para actualizar datos del usuario
  const updateUser = (newUserData) => {
    const updatedUser = { ...user, ...newUserData };
    if (updatedUser.nombres && updatedUser.apellidos) {
      updatedUser.nombreCompleto = `${updatedUser.nombres} ${updatedUser.apellidos}`;
    } else if (updatedUser.nombre && updatedUser.apellido) {
      updatedUser.nombreCompleto = `${updatedUser.nombre} ${updatedUser.apellido}`;
    }
    setUser(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));
  };

  // Función para refrescar datos del usuario desde el servidor
  const refreshUserData = async () => {
    if (user && user.email) {
      try {
        const response = await axios.get(`/api/usuarios/email/${user.email}`);
        if (response.data && response.data.user) {
          const userData = response.data.user;
          userData.nombreCompleto = `${userData.nombre} ${userData.apellido}`;
          setUser(userData);
          localStorage.setItem('userData', JSON.stringify(userData));
          return userData;
        }
      } catch (err) {
        console.error('Error al refrescar datos del usuario:', err);
      }
    }
    return user;
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return user !== null;
  };

  // Verificar si el usuario es admin
  const isAdmin = () => {
    return user && user.rol === 'admin';
  };

  // Cargar datos al inicializar
  useEffect(() => {
    loadUserData();
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateUser,
    refreshUserData,
    isAuthenticated,
    isAdmin,
    loadUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;