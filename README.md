# Sistema web para mejorar la seguridad ciudadana en San Juan Bautista

Este proyecto busca centralizar la información y mejorar la comunicación entre ciudadanos y autoridades para una respuesta más eficiente ante incidencias de seguridad ciudadana.

## Estructura
- `/frontend`: Aplicación React (dashboard en .jsx, resto en .js)
- `/backend`: Espacio para el backend (Node.js/Express, vacío por ahora)

## Instalación y uso

### Frontend (React)
1. Entra a la carpeta del frontend:
	```bash
	cd frontend
	```
2. Instala las dependencias:
	```bash
	npm install
	```
3. Inicia la aplicación:
	```bash
	npm start
	```
	La app estará disponible en `http://localhost:3000`.

### Backend (Node.js/Express)
Actualmente vacío. Puedes iniciar tu backend aquí usando Node.js y Express.

## Desarrollo
- El dashboard principal está en `/frontend/src/dashboard/Dashboard.jsx`.
- Puedes agregar más componentes en `/frontend/src/components` usando archivos `.js`.
- Para el backend, crea tus archivos en la carpeta `/backend`.

## Contribuciones
1. Haz un fork del repositorio.
2. Crea una rama para tu funcionalidad.
3. Haz un pull request con tus cambios.

---
# 🚨 Sistema de Seguridad Ciudadana - San Juan Bautista

Sistema web completo para la gestión de incidencias de seguridad ciudadana, desarrollado para mejorar la comunicación entre ciudadanos y autoridades locales.

## 📋 Características Principales

### Para Ciudadanos
- 📝 **Registro de Incidencias**: Formulario intuitivo para reportar situaciones de seguridad
- 🗺️ **Ubicación Precisa**: Selección de ubicación mediante mapa interactivo
- 📱 **Interfaz Responsiva**: Diseño adaptado para móviles y desktop
- 🔐 **Autenticación Segura**: Sistema de registro y login con Firebase

### Para Administradores
- 📊 **Dashboard Administrativo**: Panel de control con estadísticas en tiempo real
- 🔔 **Notificaciones**: Sistema de alertas para nuevas incidencias
- 👥 **Gestión de Usuarios**: Administración de ciudadanos y personal
- 📈 **Reportes y Análisis**: Gráficos y estadísticas detalladas
- 🗂️ **Gestión de Incidencias**: Seguimiento y actualización de estados

## 🛠️ Tecnologías Utilizadas

### Frontend
- ⚛️ **React 19** - Framework principal
- 🎨 **Material-UI** - Componentes de interfaz
- 🎯 **TailwindCSS** - Estilos utilitarios
- 🗺️ **Leaflet** - Mapas interactivos
- 📊 **Chart.js** - Gráficos y estadísticas

### Backend
- 🟢 **Node.js** - Servidor
- 🚀 **Express.js** - Framework web
- 🗄️ **MySQL** - Base de datos
- 🔑 **Firebase Auth** - Autenticación
- 🔐 **bcryptjs** - Encriptación

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- MySQL Server
- Git

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/seguridad-ciudadana.git
cd seguridad-ciudadana
```

### 2. Configurar Backend
```bash
cd backend
npm install
```

Crear archivo `.env` en la carpeta backend:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=sistema_incidentes_nuevo
PORT=5000
```

### 3. Configurar Base de Datos
```bash
# Ejecutar el script SQL para crear las tablas
mysql -u root -p < crear_tabla.sql
```

### 4. Configurar Frontend
```bash
cd ../frontend
npm install
```

Crear archivo `.env` en la carpeta frontend:
```env
REACT_APP_FIREBASE_API_KEY=tu_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=tu_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=tu_project_id
REACT_APP_API_URL=http://localhost:5000
```

### 5. Ejecutar la Aplicación

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
seguridad-ciudadana/
├── backend/                 # Servidor Node.js
│   ├── index.js            # Punto de entrada del servidor
│   ├── crear_tabla.sql     # Script de base de datos
│   └── package.json        # Dependencias del backend
├── frontend/               # Aplicación React
│   ├── public/            # Archivos públicos
│   ├── src/               # Código fuente
│   │   ├── components/    # Componentes reutilizables
│   │   ├── dashboard/     # Panel administrativo
│   │   ├── auth/          # Autenticación
│   │   └── ...           # Otros archivos
│   └── package.json       # Dependencias del frontend
└── README.md              # Documentación
```

## 🎮 Uso del Sistema

### Ciudadanos
1. Registrarse con email y contraseña
2. Iniciar sesión
3. Acceder al formulario de registro de incidencias
4. Completar información del incidente
5. Seleccionar ubicación en el mapa
6. Enviar reporte

### Administradores
1. Iniciar sesión con credenciales administrativas
2. Acceder al dashboard
3. Revisar incidencias en tiempo real
4. Gestionar usuarios y personal
5. Generar reportes y estadísticas

## 🔧 API Endpoints

### Autenticación
- `POST /register` - Registro de usuarios
- `POST /login` - Inicio de sesión

### Incidencias
- `GET /incidencias` - Obtener todas las incidencias
- `POST /incidencias` - Crear nueva incidencia
- `PUT /incidencias/:id` - Actualizar incidencia

### Usuarios
- `GET /usuarios` - Obtener lista de usuarios
- `GET /personal` - Obtener personal registrado

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 👥 Equipo de Desarrollo

- **Frontend**: React con Material-UI y TailwindCSS
- **Backend**: Node.js con Express y MySQL
- **Base de Datos**: Sistema relacional con MySQL
- **Autenticación**: Firebase Authentication

## 📞 Soporte

Para soporte o preguntas sobre el sistema:
- Email: soporte@seguridad-ciudadana.com
- Teléfono: +51 xxx xxx xxx

---

**Desarrollado para mejorar la seguridad ciudadana en San Juan Bautista** 🏛️