const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de la conexión MySQL - NUEVA ESTRUCTURA
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'seguridad_ciudadana'  // ✅ Base de datos con nueva estructura
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar a MySQL:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Conectado a seguridad_ciudadana (nueva estructura)');
    
    // Crear usuario admin automáticamente si no existe
    const adminEmail = 'admin@seguridad.com';
    const adminPassword = 'admin123';
    
    db.query('SELECT * FROM personal WHERE email = ?', [adminEmail], async (err, results) => {
      if (err || results.length === 0) {
        console.log('🔧 Creando usuario admin automáticamente...');
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        
        db.query(`INSERT INTO personal (dni, nombres, apellidos, email, telefono, clave, cod_cargo, cod_rol, estado) 
                 VALUES ('12345678', 'Administrador', 'Sistema', ?, '999999999', ?, 1, 1, TRUE)`, 
                 [adminEmail, hashedPassword], (err) => {
          if (err) {
            console.log('ℹ️ Admin ya existe o error menor:', err.message);
          } else {
            console.log('✅ Usuario admin creado automáticamente');
          }
        });
      } else {
        console.log('✅ Usuario admin ya existe');
      }
    });
  }
});

// Endpoint para obtener información del usuario (para frontend)
app.get('/api/user/:email', (req, res) => {
  const { email } = req.params;
  
  // Buscar en ciudadano primero
  db.query('SELECT dni, nombres, apellidos, email, telefono, fecha_creacion, "ciudadano" as tipo FROM ciudadano WHERE email = ?', [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al buscar usuario', details: err.message });
    }
    
    if (results.length > 0) {
      return res.json({ success: true, user: results[0] });
    }
    
    // Si no está en ciudadano, buscar en personal
    db.query(`SELECT p.dni, p.nombres, p.apellidos, p.email, p.telefono, p.fecha_creacion, 
                     c.denominacion as cargo, r.denominacion as rol, "personal" as tipo
              FROM personal p
              JOIN cargo c ON p.cod_cargo = c.cod_cargo  
              JOIN rol r ON p.cod_rol = r.cod_rol
              WHERE p.email = ?`, [email], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error al buscar usuario', details: err.message });
      }
      
      if (results.length > 0) {
        return res.json({ success: true, user: results[0] });
      }
      
      return res.status(404).json({ error: 'Usuario no encontrado' });
    });
  });
});

// Endpoint para login
app.post('/api/login', (req, res) => {
  let { email, password, firebase_uid } = req.body;
  console.log('POST /api/login body:', req.body);

  if (!email || (!password && !firebase_uid)) {
    return res.status(400).json({ error: 'Email y contraseña o firebase_uid son requeridos' });
  }

  // Buscar en personal primero (administradores)
  db.query(`SELECT p.*, c.denominacion as cargo, r.denominacion as rol 
            FROM personal p
            JOIN cargo c ON p.cod_cargo = c.cod_cargo
            JOIN rol r ON p.cod_rol = r.cod_rol  
            WHERE p.email = ?`, [email], async (err, results) => {
    if (err) {
      console.error('❌ Error al buscar en personal:', err.message);
      return res.status(500).json({ error: 'Error al buscar usuario', details: err.message });
    }

    if (results.length > 0) {
      const user = results[0];
      let match = false;

      // Verificar contraseña para personal
      if (password && user.clave) {
        try {
          match = await bcrypt.compare(password, user.clave);
        } catch (e) {
          match = false;
        }
      }

      if (match) {
        const { clave: _, ...userData } = user;
        userData.tipo = 'personal';
        return res.json({ success: true, user: userData });
      }
    }

    // Si no está en personal, buscar en ciudadano
    db.query('SELECT * FROM ciudadano WHERE email = ?', [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error al buscar ciudadano', details: err.message });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
      }

      const user = results[0];
      user.tipo = 'ciudadano';
      
      // Para ciudadanos, permitir login sin contraseña (solo con firebase_uid)
      return res.json({ success: true, user: user });
    });
  });
});

// Endpoint para registrar ciudadano
app.post('/api/register', (req, res) => {
  let { nombres, apellidos, email, telefono, dni } = req.body;
  console.log('POST /api/register body:', req.body);

  if (!nombres || !apellidos || !dni || !telefono || !email) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const sql = `INSERT INTO ciudadano (dni, nombres, apellidos, email, telefono, estado, fecha_creacion) 
               VALUES (?, ?, ?, ?, ?, TRUE, CURDATE())`;
               
  db.query(sql, [dni, nombres, apellidos, email, telefono], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        // Si ya existe, devolver el usuario
        db.query('SELECT * FROM ciudadano WHERE email = ? OR dni = ?', [email, dni], (err2, results) => {
          if (err2 || results.length === 0) {
            return res.status(409).json({ error: 'El usuario ya está registrado' });
          }
          const user = results[0];
          user.tipo = 'ciudadano';
          return res.status(409).json({ error: 'El usuario ya está registrado', user: user });
        });
        return;
      }
      console.error('❌ Error al registrar ciudadano:', err.message);
      return res.status(500).json({ error: 'Error al registrar usuario', details: err.message });
    }

    // Devolver el usuario recién creado
    db.query('SELECT * FROM ciudadano WHERE dni = ?', [dni], (err2, results) => {
      if (err2 || results.length === 0) {
        return res.json({ success: true, dni: dni });
      }
      const user = results[0];
      user.tipo = 'ciudadano';
      res.json({ success: true, user: user });
    });
  });
});

// Endpoint para registrar incidencia
app.post('/api/incidentes', (req, res) => {
  const { tipo, ubicacion, descripcion, fecha, latitud, longitud, dni_ciudadano, prioridad } = req.body;
  
  if (!tipo || !ubicacion || !descripcion || !fecha || !dni_ciudadano) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  // Buscar el tipo de incidencia
  db.query('SELECT cod_tipoincidencia FROM tipoincidencia WHERE denominacion LIKE ?', [`%${tipo}%`], (err, tipoResults) => {
    let cod_tipoincidencia = 6; // Otros por defecto
    
    if (!err && tipoResults.length > 0) {
      cod_tipoincidencia = tipoResults[0].cod_tipoincidencia;
    }

    const fechaIncidencia = new Date(fecha);
    const sql = `INSERT INTO incidencia (dni_ciudadano, cod_tipoincidencia, descripcion, ubicacion, 
                 fecha_incidencia, hora_incidencia, latitud, longitud, estado, fecha_registro, prioridad) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'REPORTADO', NOW(), ?)`;

    db.query(sql, [
      dni_ciudadano, 
      cod_tipoincidencia, 
      descripcion, 
      ubicacion,
      fechaIncidencia.toISOString().split('T')[0], // fecha
      fechaIncidencia.toTimeString().split(' ')[0], // hora
      latitud || null,
      longitud || null,
      prioridad || 'MEDIA'
    ], (err, result) => {
      if (err) {
        console.error('❌ Error al crear incidencia:', err.message);
        return res.status(500).json({ error: 'Error al crear incidencia', details: err.message });
      }
      res.json({ success: true, id: result.insertId });
    });
  });
});

// Endpoint para obtener incidencias
app.get('/api/incidentes', (req, res) => {
  const sql = `SELECT * FROM v_incidencias_detalle ORDER BY fecha_registro DESC LIMIT 100`;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error al obtener incidencias:', err.message);
      return res.status(500).json({ error: 'Error al obtener incidencias', details: err.message });
    }
    res.json({ success: true, incidentes: results });
  });
});

// Endpoint para obtener estadísticas
app.get('/api/estadisticas', (req, res) => {
  const queries = [
    'SELECT COUNT(*) as total_ciudadanos FROM ciudadano WHERE estado = TRUE',
    'SELECT COUNT(*) as total_incidencias FROM incidencia',
    'SELECT COUNT(*) as total_personal FROM personal WHERE estado = TRUE',
    `SELECT ti.denominacion, COUNT(*) as cantidad 
     FROM incidencia i 
     JOIN tipoincidencia ti ON i.cod_tipoincidencia = ti.cod_tipoincidencia 
     GROUP BY ti.denominacion 
     ORDER BY cantidad DESC`
  ];

  Promise.all(queries.map(query => 
    new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    })
  )).then(results => {
    res.json({
      success: true,
      estadisticas: {
        total_ciudadanos: results[0][0].total_ciudadanos,
        total_incidencias: results[1][0].total_incidencias,
        total_personal: results[2][0].total_personal,
        tipos_incidencia: results[3]
      }
    });
  }).catch(err => {
    console.error('❌ Error al obtener estadísticas:', err.message);
    res.status(500).json({ error: 'Error al obtener estadísticas', details: err.message });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend escuchando en puerto ${PORT}`);
});