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

// Configuración de la conexión MySQL - SOLO sistema_incidentes_nuevo
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'sistema_incidentes_nuevo'  // ✅ Base de datos única y definitiva
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar a MySQL:', err.message);
    console.log('💡 Verifica que la base de datos sistema_incidentes_nuevo exista');
    process.exit(1);
  } else {
    console.log('✅ Conectado a sistema_incidentes_nuevo');
    
    // Crear usuario admin automáticamente
    setupAdmin();
  }
});

function setupAdmin() {
  const adminEmail = 'admin@seguridad.com';
  const adminPassword = 'admin123';
  const adminDni = '12345678';
  
  db.query('SELECT * FROM Personal WHERE email = ?', [adminEmail], async (err, results) => {
    if (err || results.length === 0) {
      console.log('🔧 Creando usuario admin automáticamente...');
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      // PASO 1: Crear ciudadano admin primero (requerido por foreign key)
      db.query(`INSERT IGNORE INTO Ciudadano (dni, nombres, apellidos, email, num_telefono1, estado, fecha_creacion) 
               VALUES (?, 'Administrador', 'Sistema', ?, '999999999', TRUE, CURDATE())`, 
               [adminDni, adminEmail], (err) => {
        if (err && !err.message.includes('Duplicate entry')) {
          console.log('ℹ️ Error al crear ciudadano admin:', err.message);
          return;
        }
        
        // PASO 2: Asegurar que existan Cargo y Rol antes de crear admin
        db.query(`INSERT IGNORE INTO Cargo (cod_cargo, denominacion, estado, orden) VALUES (1, 'Administrador', TRUE, '001')`, (err) => {
          db.query(`INSERT IGNORE INTO Rol (cod_rol, denominacion, estado, orden) VALUES (1, 'Super Admin', TRUE, '001')`, (err) => {
            
            // PASO 3: Crear personal admin
            db.query(`INSERT INTO Personal (dni, nombres, apellidos, email, telefono, clave, cod_cargo, cod_rol, estado) 
                     VALUES (?, 'Administrador', 'Sistema', ?, '999999999', ?, 1, 1, TRUE)`, 
                     [adminDni, adminEmail, hashedPassword], (err) => {
              if (err) {
                console.log('ℹ️ Admin ya existe o error menor:', err.message);
              } else {
                console.log('✅ Usuario admin creado automáticamente');
              }
            });
          });
        });
      });
    } else {
      console.log('✅ Usuario admin ya existe - sistema_incidentes_nuevo listo');
    }
  });
}

// ✅ Función eliminada - Solo usamos setupAdmin() para sistema_incidentes_nuevo

// Endpoint para obtener información del usuario (para frontend)
app.get('/api/user/:email', (req, res) => {
  const { email } = req.params;
  
  // Buscar en ciudadano primero
  db.query('SELECT dni, nombres, apellidos, email, num_telefono1, fecha_creacion, "ciudadano" as tipo FROM Ciudadano WHERE email = ?', [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al buscar usuario', details: err.message });
    }
    
    if (results.length > 0) {
      return res.json({ success: true, user: results[0] });
    }
    
    // Si no está en ciudadano, buscar en personal
    db.query(`SELECT p.dni, p.nombres, p.apellidos, p.email, p.telefono, p.fecha_ingreso as fecha_creacion, 
                     c.denominacion as cargo, r.denominacion as rol, "personal" as tipo
              FROM Personal p
              JOIN Cargo c ON p.cod_cargo = c.cod_cargo  
              JOIN Rol r ON p.cod_rol = r.cod_rol
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
            FROM Personal p
            LEFT JOIN Cargo c ON p.cod_cargo = c.cod_cargo
            LEFT JOIN Rol r ON p.cod_rol = r.cod_rol  
            WHERE p.email = ?`, [email], async (err, results) => {
    if (err) {
      console.error('❌ Error al buscar en personal:', err.message);
      return res.status(500).json({ error: 'Error al buscar usuario', details: err.message });
    }

    console.log(`🔍 Login attempt - Email: ${email}, Found in Personal: ${results.length > 0}`);

    if (results.length > 0) {
      const user = results[0];
      let match = false;

      // Verificar contraseña para personal
      if (password && user.clave) {
        try {
          match = await bcrypt.compare(password, user.clave);
          console.log(`🔐 Password match for ${email}: ${match}`);
        } catch (e) {
          console.log(`❌ Error comparing password: ${e.message}`);
          match = false;
        }
      }

      if (match) {
        const { clave: _, ...userData } = user;
        userData.tipo = 'personal';
        console.log(`✅ Login successful for admin: ${email}`);
        return res.json({ success: true, user: userData });
      } else {
        console.log(`❌ Password mismatch for: ${email}`);
      }
    } else {
      console.log(`ℹ️ Usuario ${email} no encontrado en Personal`);
    }

    // Si no está en personal, buscar en ciudadano
    db.query('SELECT * FROM Ciudadano WHERE email = ?', [email], async (err, results) => {
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

  const sql = `INSERT INTO Ciudadano (dni, nombres, apellidos, email, num_telefono1, estado, fecha_creacion) 
               VALUES (?, ?, ?, ?, ?, TRUE, CURDATE())`;
               
  db.query(sql, [dni, nombres, apellidos, email, telefono], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        // Si ya existe, devolver el usuario
        db.query('SELECT * FROM Ciudadano WHERE email = ? OR dni = ?', [email, dni], (err2, results) => {
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
    db.query('SELECT * FROM Ciudadano WHERE dni = ?', [dni], (err2, results) => {
      if (err2 || results.length === 0) {
        return res.json({ success: true, dni: dni });
      }
      const user = results[0];
      user.tipo = 'ciudadano';
      res.json({ success: true, user: user });
    });
  });
});

// Endpoint para obtener tipos de incidencia, falta y delito
app.get('/api/tipos', (req, res) => {
  const queries = [
    'SELECT cod_tipoincidencia as id, denominacion, descripcion FROM TipoIncidencia WHERE estado = TRUE',
    'SELECT cod_tipofalta as id, denominacion, descripcion FROM TipoFalta WHERE estado = TRUE',
    'SELECT cod_tipodelito as id, denominacion, descripcion FROM TipoDelito WHERE estado = TRUE'
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
      tipos: {
        incidencias: results[0],
        faltas: results[1],
        delitos: results[2]
      }
    });
  }).catch(err => {
    console.error('❌ Error al obtener tipos:', err.message);
    res.status(500).json({ error: 'Error al obtener tipos', details: err.message });
  });
});

// Endpoint para registrar incidencia
app.post('/api/incidentes', (req, res) => {
  const { 
    descripcion, 
    direccion, 
    latitud, 
    longitud, 
    dni, 
    cod_tipofalta, 
    cod_tipodelito 
  } = req.body;
  
  console.log('POST /api/incidentes body:', req.body);
  
  if (!descripcion || !direccion || !dni) {
    return res.status(400).json({ error: 'Faltan campos obligatorios: descripcion, direccion, dni' });
  }

  // Verificar que el ciudadano existe
  db.query('SELECT dni FROM Ciudadano WHERE dni = ?', [dni], (err, results) => {
    if (err) {
      console.error('❌ Error al verificar ciudadano:', err.message);
      return res.status(500).json({ error: 'Error al verificar ciudadano', details: err.message });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Ciudadano no encontrado' });
    }

    // Crear fechas actuales con JavaScript para asegurar compatibilidad
    const fechaActual = new Date();
    const fechaString = fechaActual.toISOString().split('T')[0]; // YYYY-MM-DD
    const horaString = fechaActual.toTimeString().split(' ')[0]; // HH:MM:SS

    const sql = `INSERT INTO Incidencia 
                 (descripcion, direccion, dni, latitud, longitud, cod_tipofalta, cod_tipodelito, estado, fecha, hora) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, 'pendiente', ?, ?)`;

    db.query(sql, [
      descripcion,
      direccion,
      dni,
      latitud || null,
      longitud || null,
      cod_tipofalta || null,
      cod_tipodelito || null,
      fechaString,
      horaString
    ], (err, result) => {
      if (err) {
        console.error('❌ Error al crear incidencia:', err.message);
        return res.status(500).json({ error: 'Error al crear incidencia', details: err.message });
      }
      
      console.log(`✅ Incidencia creada exitosamente con ID: ${result.insertId}`);
      console.log(`📅 Fecha registrada: ${fechaString}`);
      console.log(`🕐 Hora registrada: ${horaString}`);
      res.json({ 
        success: true, 
        codigo_incidente: result.insertId,
        fecha: fechaString,
        hora: horaString
      });
    });
  });
});

// Endpoint para obtener incidencias
app.get('/api/incidentes', (req, res) => {
  const sql = `
    SELECT 
      i.codigo_incidente as id,
      i.descripcion,
      i.direccion,
      i.latitud as lat,
      i.longitud as lng,
      i.fecha_creacion,
      i.fecha,
      i.hora,
      i.estado,
      i.cod_tipofalta,
      i.cod_tipodelito,
      CASE 
        WHEN i.cod_tipofalta IS NOT NULL THEN 'Falta'
        WHEN i.cod_tipodelito IS NOT NULL THEN 'Delito'
        ELSE 'Sin clasificar'
      END as categoria,
      COALESCE(tf.denominacion, td.denominacion, 'Sin tipo especificado') as tipo,
      COALESCE(tf.descripcion, td.descripcion, 'Sin descripción') as tipo_descripcion,
      CONCAT(c.nombres, ' ', c.apellidos) as nombre_ciudadano,
      c.email as email_ciudadano,
      c.num_telefono1 as telefono_ciudadano,
      c.dni
    FROM Incidencia i
    LEFT JOIN TipoFalta tf ON i.cod_tipofalta = tf.cod_tipofalta AND tf.estado = TRUE
    LEFT JOIN TipoDelito td ON i.cod_tipodelito = td.cod_tipodelito AND td.estado = TRUE
    LEFT JOIN Ciudadano c ON i.dni = c.dni
    ORDER BY COALESCE(i.fecha, i.fecha_creacion) DESC 
    LIMIT 100
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error al obtener incidencias:', err.message);
      return res.status(500).json({ error: 'Error al obtener incidencias', details: err.message });
    }
    
    console.log(`✅ Obtenidas ${results.length} incidencias`);
    
    // Debug: mostrar la primera incidencia para verificar los datos
    if (results.length > 0) {
      console.log('🔍 Primera incidencia:', results[0]);
    }
    
    // Devolver directamente los resultados para que el Dashboard los pueda usar
    res.json(results);
  });
});

// Endpoint para obtener estadísticas
app.get('/api/estadisticas', (req, res) => {
  const queries = [
    'SELECT COUNT(*) as total_ciudadanos FROM Ciudadano WHERE estado = TRUE',
    'SELECT COUNT(*) as total_incidencias FROM Incidencia',
    'SELECT COUNT(*) as total_personal FROM Personal WHERE estado = TRUE',
    `SELECT 'Faltas' as categoria, tf.denominacion, COUNT(*) as cantidad 
     FROM Incidencia i 
     JOIN TipoFalta tf ON i.cod_tipofalta = tf.cod_tipofalta 
     GROUP BY tf.denominacion
     UNION ALL
     SELECT 'Delitos' as categoria, td.denominacion, COUNT(*) as cantidad 
     FROM Incidencia i 
     JOIN TipoDelito td ON i.cod_tipodelito = td.cod_tipodelito 
     GROUP BY td.denominacion
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

// Endpoint para actualizar estado de incidente
app.put('/api/incidentes/:id/estado', (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  
  const query = `UPDATE Incidencia SET estado = ? WHERE codigo_incidente = ?`;
  
  db.query(query, [estado, id], (err, result) => {
    if (err) {
      console.error('❌ Error al actualizar estado de incidencia:', err.message);
      return res.status(500).json({ error: 'Error al actualizar estado', details: err.message });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Incidencia no encontrada' });
    }
    
    res.json({ success: true, message: 'Estado actualizado correctamente' });
  });
});

// Endpoint para obtener estadísticas de un usuario específico
app.get('/api/usuarios/:id/estadisticas', (req, res) => {
  const { id } = req.params;
  
  const queries = [
    `SELECT COUNT(*) as total_reportes FROM Incidencia WHERE dni = ?`,
    `SELECT COUNT(*) as resueltos FROM Incidencia WHERE dni = ? AND estado = 'resuelto'`,
    `SELECT COUNT(*) as en_proceso FROM Incidencia WHERE dni = ? AND estado = 'en_proceso'`
  ];

  Promise.all(queries.map(query => 
    new Promise((resolve, reject) => {
      db.query(query, [id], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    })
  )).then(results => {
    const total = results[0][0].total_reportes;
    const resueltos = results[1][0].resueltos;
    const en_proceso = results[2][0].en_proceso;
    const efectividad = total > 0 ? Math.round((resueltos / total) * 100) : 0;
    
    res.json({
      success: true,
      estadisticas: {
        total_reportes: total,
        resueltos: resueltos,
        en_proceso: en_proceso,
        efectividad: efectividad
      }
    });
  }).catch(err => {
    console.error('❌ Error al obtener estadísticas del usuario:', err.message);
    res.status(500).json({ error: 'Error al obtener estadísticas del usuario', details: err.message });
  });
});

// Endpoint para obtener lista de usuarios/ciudadanos
app.get('/api/usuarios', (req, res) => {
  const query = `
    SELECT 
      dni,
      dni as id,
      nombres,
      apellidos,
      email,
      num_telefono1 as telefono,
      fecha_creacion,
      estado
    FROM Ciudadano 
    WHERE estado = TRUE
    ORDER BY fecha_creacion DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error al obtener usuarios:', err.message);
      return res.status(500).json({ error: 'Error al obtener usuarios', details: err.message });
    }
    res.json({ success: true, usuarios: results });
  });
});

// Endpoint para obtener lista de personal
app.get('/api/personal', (req, res) => {
  const query = `
    SELECT 
      p.codigo as id,
      p.nombres,
      p.apellidos,
      p.email,
      p.telefono,
      p.fecha_ingreso,
      p.estado,
      c.denominacion as cargo,
      r.denominacion as rol
    FROM Personal p
    LEFT JOIN Cargo c ON p.cod_cargo = c.cod_cargo
    LEFT JOIN Rol r ON p.cod_rol = r.cod_rol
    WHERE p.estado = TRUE
    ORDER BY p.fecha_ingreso DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error al obtener personal:', err.message);
      return res.status(500).json({ error: 'Error al obtener personal', details: err.message });
    }
    res.json({ success: true, personal: results });
  });
});

// Endpoint para cambiar rol de usuario
app.put('/api/usuarios/:dni/rol', (req, res) => {
  const { dni } = req.params;
  const { cargo, rol, action } = req.body; // action: 'promote' o 'demote'
  
  if (action === 'promote') {
    // Convertir ciudadano en personal
    db.query('SELECT * FROM Ciudadano WHERE dni = ?', [dni], (err, ciudadanos) => {
      if (err || ciudadanos.length === 0) {
        return res.status(404).json({ error: 'Ciudadano no encontrado' });
      }
      
      const ciudadano = ciudadanos[0];
      const insertPersonal = `
        INSERT INTO Personal (dni, nombres, apellidos, email, telefono, cod_cargo, cod_rol, estado) 
        VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)
      `;
      
      db.query(insertPersonal, [
        dni, 
        ciudadano.nombres, 
        ciudadano.apellidos, 
        ciudadano.email, 
        ciudadano.num_telefono1, 
        cargo, 
        rol
      ], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error al promover usuario', details: err.message });
        }
        res.json({ success: true, message: 'Usuario promovido a personal' });
      });
    });
  } else if (action === 'demote') {
    // Eliminar de personal (mantener como ciudadano)
    db.query('DELETE FROM Personal WHERE dni = ?', [dni], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error al degradar usuario', details: err.message });
      }
      res.json({ success: true, message: 'Usuario convertido a ciudadano' });
    });
  } else if (action === 'update') {
    // Actualizar rol de personal existente
    db.query('UPDATE Personal SET cod_cargo = ?, cod_rol = ? WHERE dni = ?', [cargo, rol, dni], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error al actualizar rol', details: err.message });
      }
      res.json({ success: true, message: 'Rol actualizado' });
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend escuchando en puerto ${PORT}`);
});