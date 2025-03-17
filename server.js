const express = require('express');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3001;

// Crear la carpeta 'images' si no existe
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}

app.use(cors());
app.use(bodyParser.json());
app.use('/images', express.static(imagesDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'biblioteca',
  port: 3306
});

db.connect(err => {
  if (err) {
    console.error('Error conectando a MySQL: ', err);
    return;
  }
  console.log('MySQL conectado');
});

app.post('/books', upload.single('imagen'), (req, res) => {
  const book = req.body;
  const imagen = req.file ? req.file.filename : null;
  console.log('Datos del libro recibido:', book);
  console.log('Imagen recibida:', req.file);

  const sql = 'INSERT INTO books (nombre, editorial, autor, genero_id, subgenero_id, ano, ISBN, descripcion, imagen, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [book.nombre, book.editorial, book.autor, book.genero_id, book.subgenero_id, book.ano, book.ISBN, book.descripcion, imagen, book.estado], (err, result) => {
    if (err) {
      console.error('Error ejecutando la consulta: ', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    res.send({ id: result.insertId, ...book, imagen });
  });
});

app.get('/books', (req, res) => {
  const sql = 'SELECT * FROM books';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error ejecutando la consulta: ', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    res.send(results);
  });
});

app.put('/books/:id', upload.single('imagen'), (req, res) => {
  const id = req.params.id;
  const book = req.body;
  const imagen = req.file ? req.file.filename : book.imagen;
  console.log('Datos del libro recibido para actualización:', book);
  console.log('Imagen recibida para actualización:', req.file);

  const sql = 'UPDATE books SET nombre = ?, editorial = ?, autor = ?, genero_id = ?, subgenero_id = ?, ano = ?, ISBN = ?, descripcion = ?, imagen = ?, estado = ? WHERE id = ?';
  db.query(sql, [book.nombre, book.editorial, book.autor, book.genero_id, book.subgenero_id, book.ano, book.ISBN, book.descripcion, imagen, book.estado, id], (err, result) => {
    if (err) {
      console.error('Error ejecutando la consulta: ', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    res.send(result);
  });
});

app.delete('/books/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM books WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error ejecutando la consulta: ', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    res.send(result);
  });
});

app.post('/reservas', (req, res) => {
  const reserva = req.body;
  const sql = 'INSERT INTO reservas (book_id, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?)';
  db.query(sql, [reserva.book_id, reserva.fecha_inicio, reserva.fecha_fin, reserva.estado], (err, result) => {
    if (err) {
      console.error('Error ejecutando la consulta: ', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    res.send({ id: result.insertId, ...reserva });
  });
});

app.get('/reservas', (req, res) => {
  const sql = 'SELECT * FROM reservas';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error ejecutando la consulta: ', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    res.send(results);
  });
});

app.delete('/reservas/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM reservas WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error ejecutando la consulta: ', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    res.send(result);
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});