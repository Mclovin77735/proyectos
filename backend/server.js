const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'tienda'
});

db.connect(err => {
  if (err) throw err;
  console.log('Conectado a la base de datos MySQL');
});

// Ruta para guardar el carrito
app.post('/guardar-carrito', (req, res) => {
  const { carrito, nombre, correo } = req.body;

  // Validación básica
  if (!carrito || !Array.isArray(carrito) || !nombre || !correo) {
    return res.status(400).send({ error: 'Faltan datos necesarios' });
  }

  // Guardar cada producto en la base de datos
  carrito.forEach(item => {
    const { id, name, price } = item;

    const sql = 'INSERT INTO carrito (producto_id, nombre, precio, cliente_nombre, cliente_correo) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [id, name, price, nombre, correo], (err) => {
      if (err) {
        console.error('Error al guardar en la base de datos:', err);
        return res.status(500).send({ error: 'Error al guardar en la base de datos' });
      }
    });
  });

  res.send({ mensaje: 'Productos guardados en la base de datos' });
});

app.post('/finalizar-compra', (req, res) => {
    const { carrito, nombre, correo } = req.body;
  
    if (!carrito || !Array.isArray(carrito) || !nombre || !correo) {
      return res.status(400).send({ error: 'Faltan datos necesarios' });
    }
  
    carrito.forEach(item => {
      const { id, name, price } = item;
  
      const sql = 'INSERT INTO carrito (producto_id, nombre, precio, cliente_nombre, cliente_correo) VALUES (?, ?, ?, ?, ?)';
      db.query(sql, [id, name, price, nombre, correo], (err) => {
        if (err) {
          console.error('Error al guardar en la base de datos:', err);
          return res.status(500).send({ error: 'Error al guardar en la base de datos' });
        }
      });
    });
  
    res.send({ mensaje: 'Compra finalizada y guardada exitosamente' });
  });
  

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});


