import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  // Función para observar elementos y activar animaciones
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observar todos los elementos con clase 'fade-in-up'
    const elementsToAnimate = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .fade-in-scale');
    elementsToAnimate.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-stone-100">
      {/* Estilos CSS para animaciones */}
      <style jsx global>{`
        .fade-in-up {
          opacity: 0;
          transform: translateY(50px);
          transition: all 0.8s ease-out;
        }
        
        .fade-in-left {
          opacity: 0;
          transform: translateX(-50px);
          transition: all 0.8s ease-out;
        }
        
        .fade-in-right {
          opacity: 0;
          transform: translateX(50px);
          transition: all 0.8s ease-out;
        }
        
        .fade-in-scale {
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.8s ease-out;
        }
        
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) translateX(0) scale(1) !important;
        }
        
        .stagger-1 { transition-delay: 0.1s; }
        .stagger-2 { transition-delay: 0.2s; }
        .stagger-3 { transition-delay: 0.3s; }
        .stagger-4 { transition-delay: 0.4s; }
      `}</style>
      {/* Navigation */}
      <nav className="backdrop-blur-md border-b sticky top-0 z-50 shadow-sm" style={{backgroundColor: '#403f4c', borderColor: 'rgba(255, 255, 255, 0.2)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="Logo" className="h-10 w-10" />
              <span className="text-white font-bold text-xl">Seguridad Ciudadana</span>
            </div>
            <div className="flex space-x-4">
              <Link 
                to="/login" 
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-white/80 hover:text-white"
              >
                Iniciar Sesión
              </Link>
              <Link 
                to="/register" 
                className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Blanco con Imagen (1ra sección) */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Contenido de texto */}
            <div className="text-center space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight fade-in-up" style={{color: '#121420'}}>
                  Seguridad
                  <span className="bg-gradient-to-r bg-clip-text text-transparent fade-in-scale stagger-1" style={{backgroundImage: 'linear-gradient(#017cfc, #017cfc, #017cfc)'}}> Ciudadana</span>
                </h1>
                <p className="text-lg md:text-xl leading-relaxed fade-in-up stagger-2" style={{color: '#403f4c'}}>
                  Protegiendo nuestra comunidad a través de la <br />tecnología y la participación ciudadana
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in-up stagger-3">
                <Link 
                  to="/login" 
                  className="group text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2"
                  style={{background: 'linear-gradient(135deg, #017cfc, #017cfc)'}}
                >
                  <i className="ri-login-box-line text-xl"></i>
                  <span>Acceder al Sistema</span>
                </Link>
                <Link 
                  to="/register" 
                  className="group bg-white/80 backdrop-blur-sm hover:bg-white text-white border px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2"
                  style={{color: '#403f4c', borderColor: '#403f4c'}}
                >
                  <i className="ri-user-add-line text-xl"></i>
                  <span>Crear Cuenta</span>
                </Link>
              </div>
            </div>

            {/* Imagen */}
            <div className="fade-in-right">
              <img 
                src="/seguridad3.jpg" 
                alt="Seguridad Ciudadana" 
                className="w-2/3 h-auto mx-auto rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - #403f4c (2da sección) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center" style={{backgroundColor: '#403f4c'}}>
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center space-y-4 mb-16 fade-in-up">
            <h2 className="text-4xl font-bold text-white">¿Cómo funciona?</h2>
            <p className="text-xl text-white/80">Tres pasos simples para reportar incidencias</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 fade-in-left stagger-1">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md" style={{background: 'linear-gradient(135deg, #403f4c, #5a6069)'}}>
                <i className="ri-user-line text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-semibold mb-4" style={{color: '#121420'}}>1. Regístrate</h3>
              <p style={{color: '#403f4c'}}>Crea tu cuenta de forma rápida y segura para acceder al sistema</p>
            </div>
            
            <div className="text-center group bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 fade-in-up stagger-2">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md" style={{background: 'linear-gradient(135deg, #2e3845, #403f4c)'}}>
                <i className="ri-map-pin-line text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">2. Reporta</h3>
              <p className="text-white/80">Informa sobre incidencias en tu zona de manera fácil y rápida</p>
            </div>
            
            <div className="text-center group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 fade-in-right stagger-3">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md" style={{background: 'linear-gradient(135deg, #1e2633, #2e3845)'}}>
                <i className="ri-shield-check-line text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-semibold mb-4" style={{color: '#121420'}}>3. Colabora</h3>
              <p style={{color: '#403f4c'}}>Contribuye a la seguridad de tu comunidad con tu participación</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Blanco (3ra sección) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center space-y-4 mb-16 fade-in-up">
            <h2 className="text-4xl font-bold" style={{color: '#121420'}}>Nuestra Comunidad</h2>
            <p className="text-xl" style={{color: '#403f4c'}}>Números que hablan por sí solos</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center bg-gray-50 rounded-xl p-6 shadow-lg border border-gray-200/50 fade-in-scale stagger-1">
              <div className="text-4xl font-bold mb-2" style={{color: '#403f4c'}}>1,200+</div>
              <div style={{color: '#403f4c'}}>Usuarios Registrados</div>
            </div>
            <div className="text-center rounded-xl p-6 shadow-lg border fade-in-scale stagger-2" style={{backgroundColor: 'rgba(64, 63, 76, 0.08)', borderColor: 'rgba(64, 63, 76, 0.2)'}}>
              <div className="text-4xl font-bold mb-2" style={{color: '#2e3845'}}>3,500+</div>
              <div style={{color: '#403f4c'}}>Reportes Realizados</div>
            </div>
            <div className="text-center bg-gray-50 rounded-xl p-6 shadow-lg border border-gray-200/50 fade-in-scale stagger-3">
              <div className="text-4xl font-bold mb-2" style={{color: '#403f4c'}}>95%</div>
              <div style={{color: '#403f4c'}}>Casos Resueltos</div>
            </div>
            <div className="text-center rounded-xl p-6 shadow-lg border fade-in-scale stagger-4" style={{backgroundColor: 'rgba(64, 63, 76, 0.08)', borderColor: 'rgba(64, 63, 76, 0.2)'}}>
              <div className="text-4xl font-bold mb-2" style={{color: '#1e2633'}}>24/7</div>
              <div style={{color: '#403f4c'}}>Monitoreo Activo</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - #403f4c (4ta sección) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center" style={{backgroundColor: '#403f4c'}}>
        <div className="max-w-4xl mx-auto text-center space-y-8 w-full">
          <h2 className="text-4xl font-bold text-white fade-in-up">¿Listo para hacer la diferencia?</h2>
          <p className="text-xl text-white/80 fade-in-up stagger-1">
            Únete a nuestra comunidad y ayuda a crear un entorno más seguro para todos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in-up stagger-2">
            <Link 
              to="/register" 
              className="bg-white text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              style={{color: '#403f4c'}}
            >
              Comenzar Ahora
            </Link>
            <button className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              Más Información
            </button>
          </div>
        </div>
      </section>

      {/* Footer - Moderno y Alineado */}
      <footer className="bg-gradient-to-br from-slate-50 via-white to-slate-100 border-t py-16 px-4 sm:px-6 lg:px-8" style={{borderColor: 'rgba(64, 63, 76, 0.15)'}}>
        <div className="max-w-7xl mx-auto">
          {/* Contenido Principal del Footer */}
          <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-12 mb-12">
            {/* Logo y Descripción */}
            <div className="lg:col-span-1 space-y-6 fade-in-left">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-xl shadow-md" style={{backgroundColor: '#403f4c'}}>
                  <img src="/logo192.png" alt="Logo" className="h-8 w-8 brightness-0 invert" />
                </div>
                <div>
                  <h3 className="font-bold text-xl tracking-tight" style={{color: '#121420'}}>
                    Seguridad Ciudadana
                  </h3>
                  <p className="text-xs font-medium mt-1" style={{color: '#403f4c'}}>
                    Comunidad Segura
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed max-w-xs" style={{color: '#64748b'}}>
                Protegiendo nuestra comunidad a través de la participación ciudadana activa y tecnología de vanguardia.
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#10b981'}}></div>
                <span className="text-xs font-medium" style={{color: '#10b981'}}>Sistema Activo 24/7</span>
              </div>
            </div>
            
            {/* Enlaces Rápidos */}
            <div className="fade-in-up stagger-1">
              <h4 className="font-bold text-sm uppercase tracking-wide mb-6" style={{color: '#121420'}}>
                Acceso Rápido
              </h4>
              <nav className="space-y-4">
                <Link 
                  to="/login" 
                  className="group flex items-center space-x-3 text-sm transition-all duration-300 hover:translate-x-1" 
                  style={{color: '#64748b'}}
                >
                  <i className="ri-login-circle-line text-base group-hover:text-[#403f4c] transition-colors"></i>
                  <span className="group-hover:text-[#403f4c] group-hover:font-medium">Iniciar Sesión</span>
                </Link>
                <Link 
                  to="/register" 
                  className="group flex items-center space-x-3 text-sm transition-all duration-300 hover:translate-x-1" 
                  style={{color: '#64748b'}}
                >
                  <i className="ri-user-add-line text-base group-hover:text-[#403f4c] transition-colors"></i>
                  <span className="group-hover:text-[#403f4c] group-hover:font-medium">Registrarse</span>
                </Link>
                <Link 
                  to="/incidencia" 
                  className="group flex items-center space-x-3 text-sm transition-all duration-300 hover:translate-x-1" 
                  style={{color: '#64748b'}}
                >
                  <i className="ri-alarm-warning-line text-base group-hover:text-[#403f4c] transition-colors"></i>
                  <span className="group-hover:text-[#403f4c] group-hover:font-medium">Reportar Incidencia</span>
                </Link>
              </nav>
            </div>
            
            {/* Soporte y Ayuda */}
            <div className="fade-in-up stagger-2">
              <h4 className="font-bold text-sm uppercase tracking-wide mb-6" style={{color: '#121420'}}>
                Soporte & Ayuda
              </h4>
              <nav className="space-y-4">
                <a 
                  href="#" 
                  className="group flex items-center space-x-3 text-sm transition-all duration-300 hover:translate-x-1" 
                  style={{color: '#64748b'}}
                >
                  <i className="ri-question-line text-base group-hover:text-[#403f4c] transition-colors"></i>
                  <span className="group-hover:text-[#403f4c] group-hover:font-medium">Centro de Ayuda</span>
                </a>
                <a 
                  href="#" 
                  className="group flex items-center space-x-3 text-sm transition-all duration-300 hover:translate-x-1" 
                  style={{color: '#64748b'}}
                >
                  <i className="ri-mail-line text-base group-hover:text-[#403f4c] transition-colors"></i>
                  <span className="group-hover:text-[#403f4c] group-hover:font-medium">Contacto</span>
                </a>
                <a 
                  href="#" 
                  className="group flex items-center space-x-3 text-sm transition-all duration-300 hover:translate-x-1" 
                  style={{color: '#64748b'}}
                >
                  <i className="ri-file-text-line text-base group-hover:text-[#403f4c] transition-colors"></i>
                  <span className="group-hover:text-[#403f4c] group-hover:font-medium">Términos de Uso</span>
                </a>
                <a 
                  href="#" 
                  className="group flex items-center space-x-3 text-sm transition-all duration-300 hover:translate-x-1" 
                  style={{color: '#64748b'}}
                >
                  <i className="ri-shield-check-line text-base group-hover:text-[#403f4c] transition-colors"></i>
                  <span className="group-hover:text-[#403f4c] group-hover:font-medium">Privacidad</span>
                </a>
              </nav>
            </div>
            
            {/* Redes Sociales y Contacto */}
            <div className="fade-in-right">
              <h4 className="font-bold text-sm uppercase tracking-wide mb-6" style={{color: '#121420'}}>
                Conecta con Nosotros
              </h4>
              <div className="space-y-6">
                {/* Redes Sociales */}
                <div>
                  <p className="text-xs font-medium mb-4" style={{color: '#64748b'}}>Síguenos en redes</p>
                  <div className="flex space-x-3">
                    <a 
                      href="#" 
                      className="group relative p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg"
                      style={{backgroundColor: 'rgba(64, 63, 76, 0.05)'}}
                    >
                      <i className="ri-facebook-fill text-lg transition-colors group-hover:text-blue-600" style={{color: '#403f4c'}}></i>
                    </a>
                    <a 
                      href="#" 
                      className="group relative p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg"
                      style={{backgroundColor: 'rgba(64, 63, 76, 0.05)'}}
                    >
                      <i className="ri-twitter-x-fill text-lg transition-colors group-hover:text-black" style={{color: '#403f4c'}}></i>
                    </a>
                    <a 
                      href="#" 
                      className="group relative p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg"
                      style={{backgroundColor: 'rgba(64, 63, 76, 0.05)'}}
                    >
                      <i className="ri-instagram-fill text-lg transition-colors group-hover:text-pink-600" style={{color: '#403f4c'}}></i>
                    </a>
                    <a 
                      href="#" 
                      className="group relative p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg"
                      style={{backgroundColor: 'rgba(64, 63, 76, 0.05)'}}
                    >
                      <i className="ri-linkedin-fill text-lg transition-colors group-hover:text-blue-700" style={{color: '#403f4c'}}></i>
                    </a>
                  </div>
                </div>
                
                {/* Información de Contacto */}
                <div className="p-4 rounded-xl" style={{backgroundColor: 'rgba(64, 63, 76, 0.03)'}}>
                  <div className="flex items-center space-x-3 mb-2">
                    <i className="ri-phone-line text-sm" style={{color: '#403f4c'}}></i>
                    <span className="text-xs font-medium" style={{color: '#64748b'}}>+51 123 456 789</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <i className="ri-mail-line text-sm" style={{color: '#403f4c'}}></i>
                    <span className="text-xs font-medium" style={{color: '#64748b'}}>info@seguridadciudadana.pe</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Línea Divisoria y Copyright */}
          <div className="border-t pt-8 fade-in-up" style={{borderColor: 'rgba(64, 63, 76, 0.1)'}}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Copyright */}
              <div className="flex items-center space-x-4">
                <p className="text-sm font-medium" style={{color: '#64748b'}}>
                  &copy; {new Date().getFullYear()} Seguridad Ciudadana. Todos los derechos reservados.
                </p>
                <div className="hidden lg:flex items-center space-x-2">
                  <div className="w-1 h-1 rounded-full" style={{backgroundColor: '#64748b'}}></div>
                  <span className="text-xs" style={{color: '#94a3b8'}}>Hecho con  en Perú</span>
                </div>
              </div>
              
              {/* Enlaces Legales */}
              <div className="flex items-center space-x-6">
                <a href="#" className="text-xs font-medium transition-colors hover:text-[#403f4c]" style={{color: '#94a3b8'}}>
                  Política de Privacidad
                </a>
                <a href="#" className="text-xs font-medium transition-colors hover:text-[#403f4c]" style={{color: '#94a3b8'}}>
                  Términos de Servicio
                </a>
                <a href="#" className="text-xs font-medium transition-colors hover:text-[#403f4c]" style={{color: '#94a3b8'}}>
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
