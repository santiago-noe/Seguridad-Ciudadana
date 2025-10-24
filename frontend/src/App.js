


import './App.css';
import ColorModeProvider from './ColorModeProvider';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Dashboard from './dashboard/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import AuthContainer from './auth/AuthContainer';
import Incidencia from './Incidencia';
import { AuthProvider } from './contexts/AuthContext';


// Simulación de autenticación simple
const isAuthenticated = () => {
  return Boolean(localStorage.getItem('userEmail'));
};


const isAdmin = () => {
  const userType = localStorage.getItem('userType');
  const userRol = localStorage.getItem('userRol');
  console.log('Checking admin access:', { userType, userRol }); // Debug
  const isAdminUser = userType === 'personal' || userRol === 'admin' || userRol === 'Super Admin';
  console.log('Is admin:', isAdminUser); // Debug
  return isAdminUser;
};

const isCitizen = () => {
  const userType = localStorage.getItem('userType');
  console.log('Checking citizen access:', { userType }); // Debug
  return userType === 'ciudadano';
};

const ProtectedRoute = ({ children, adminOnly = false, citizenOnly = false }) => {
  if (!isAuthenticated()) return <Navigate to="/login" />;
  
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/incidencia" />;
  }
  
  if (citizenOnly && !isCitizen()) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <ColorModeProvider>
        <div className="App">
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<AuthContainer />} />
              <Route path="/register" element={<AuthContainer />} />
              <Route path="/incidencia" element={
                <ProtectedRoute citizenOnly={true}>
                  <Incidencia />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute adminOnly={true}>
                  <ErrorBoundary>
                    <Dashboard />
                  </ErrorBoundary>
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
        </div>
      </ColorModeProvider>
    </AuthProvider>
  );
}

export default App;
