const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Cambia esto si tienes otro usuario
  password: 'root', // Agrega tu contraseña aquí
  database: 'biblioteca'
});

db.connect(err => {
  if (err) {
    console.error('Error conectando a MySQL: ', err);
    return;
  }
  console.log('MySQL conectado');
});

// Ruta para agregar un libro
app.post('/addBook', (req, res) => {
  const book = req.body;
  const sql = 'INSERT INTO books (nombre, editorial, autor, genero, subgenero, ano) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [book.nombre, book.editorial, book.autor, book.genero, book.subgenero, book.ano], (err, result) => {
    if (err) throw err;
    res.send({ id: result.insertId, ...book });
  });
});

// Ruta para obtener todos los libros
app.get('/books', (req, res) => {
  const sql = 'SELECT * FROM books';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});