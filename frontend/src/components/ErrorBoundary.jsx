import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Puedes enviar el error a un servicio externo aquí
    console.error('ErrorBoundary atrapó un error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 32, textAlign: 'center', color: '#b71c1c' }}>
          <h2>Ocurrió un error inesperado en el dashboard.</h2>
          <pre style={{ color: '#b71c1c', background: '#fff3e0', padding: 16, borderRadius: 8, marginTop: 16 }}>
            {this.state.error && this.state.error.toString()}
          </pre>
          <p>Por favor, recarga la página o contacta al administrador.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
