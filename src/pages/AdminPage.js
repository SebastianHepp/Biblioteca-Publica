import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function AdminPage() {
  const [bookDetails, setBookDetails] = useState({
    nombre: '',
    editorial: '',
    autor: '',
    genero_id: '',
    subgenero_id: '',
    ano: '',
    ISBN: '',
    descripcion: '',
    imagen: null,
    estado: 'disponible'
  });

  const [generos, setGeneros] = useState([]);
  const [subgeneros, setSubgeneros] = useState([]);
  const [books, setBooks] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [editingBookId, setEditingBookId] = useState(null);

  const [newGenero, setNewGenero] = useState('');
  const [newSubgenero, setNewSubgenero] = useState('');
  const [reservaDetails, setReservaDetails] = useState({
    book_id: null,
    fecha_inicio: new Date(),
    fecha_fin: new Date(),
    estado: 'reservado'
  });

  useEffect(() => {
    fetchGeneros();
    fetchSubgeneros();
    fetchBooks();
    fetchReservas();
  }, []);

  const fetchGeneros = async () => {
    const response = await axios.get('http://localhost:3001/generos');
    setGeneros(response.data);
  };

  const fetchSubgeneros = async () => {
    const response = await axios.get('http://localhost:3001/subgeneros');
    setSubgeneros(response.data);
  };

  const fetchBooks = async () => {
    const response = await axios.get('http://localhost:3001/books');
    setBooks(response.data);
  };

  const fetchReservas = async () => {
    const response = await axios.get('http://localhost:3001/reservas');
    setReservas(response.data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookDetails({ ...bookDetails, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setBookDetails({ ...bookDetails, imagen: file });
  };

  const handleAddBook = async () => {
    if (!bookDetails.nombre || !bookDetails.editorial || !bookDetails.autor || !bookDetails.genero_id || !bookDetails.subgenero_id || !bookDetails.ano || !bookDetails.ISBN) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const formData = new FormData();
    for (const key in bookDetails) {
      formData.append(key, bookDetails[key]);
    }

    try {
      const response = await axios.post('http://localhost:3001/books', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setBooks([...books, response.data]);
      setBookDetails({
        nombre: '',
        editorial: '',
        autor: '',
        genero_id: '',
        subgenero_id: '',
        ano: '',
        ISBN: '',
        descripcion: '',
        imagen: null,
        estado: 'disponible'
      });
      alert('Libro agregado exitosamente.');
    } catch (error) {
      console.error('Error añadiendo libro:', error);
    }
  };

  const handleEditBook = (book) => {
    setBookDetails(book);
    setEditingBookId(book.id);
  };

  const handleUpdateBook = async () => {
    const formData = new FormData();
    for (const key in bookDetails) {
      formData.append(key, bookDetails[key]);
    }

    try {
      await axios.put(`http://localhost:3001/books/${editingBookId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchBooks();
      setBookDetails({
        nombre: '',
        editorial: '',
        autor: '',
        genero_id: '',
        subgenero_id: '',
        ano: '',
        ISBN: '',
        descripcion: '',
        imagen: null,
        estado: 'disponible'
      });
      setEditingBookId(null);
      alert('Libro actualizado exitosamente.');
    } catch (error) {
      console.error('Error actualizando libro:', error);
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/books/${id}`);
      fetchBooks();
      alert('Libro eliminado exitosamente.');
    } catch (error) {
      console.error('Error eliminando libro:', error);
    }
  };

  const handleAddGenero = async () => {
    try {
      const response = await axios.post('http://localhost:3001/generos', { nombre: newGenero });
      setGeneros([...generos, response.data]);
      setNewGenero('');
      alert('Género agregado exitosamente.');
    } catch (error) {
      console.error('Error añadiendo género:', error);
    }
  };

  const handleAddSubgenero = async () => {
    try {
      const response = await axios.post('http://localhost:3001/subgeneros', { nombre: newSubgenero });
      setSubgeneros([...subgeneros, response.data]);
      setNewSubgenero('');
      alert('Subgénero agregado exitosamente.');
    } catch (error) {
      console.error('Error añadiendo subgénero:', error);
    }
  };

  const handleDeleteGenero = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/generos/${id}`);
      setGeneros(generos.filter(genero => genero.id !== id));
      alert('Género eliminado exitosamente.');
    } catch (error) {
      console.error('Error eliminando género:', error);
    }
  };

  const handleDeleteSubgenero = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/subgeneros/${id}`);
      setSubgeneros(subgeneros.filter(subgenero => subgenero.id !== id));
      alert('Subgénero eliminado exitosamente.');
    } catch (error) {
      console.error('Error eliminando subgénero:', error);
    }
  };

  const handleReservaChange = (date, field) => {
    setReservaDetails({ ...reservaDetails, [field]: date });
  };

  const handleAddReserva = async () => {
    if (!reservaDetails.book_id) {
      alert('Por favor, selecciona un libro.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/reservas', reservaDetails);
      setReservas([...reservas, response.data]);
      setReservaDetails({
        book_id: null,
        fecha_inicio: new Date(),
        fecha_fin: new Date(),
        estado: 'reservado'
      });
      alert('Reserva agregada exitosamente.');
    } catch (error) {
      console.error('Error añadiendo reserva:', error);
    }
  };

  const handleDeleteReserva = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/reservas/${id}`);
      fetchReservas();
      alert('Reserva eliminada exitosamente.');
    } catch (error) {
      console.error('Error eliminando reserva:', error);
    }
  };

  return (
    <div>
      <h1>Panel de Administración</h1>
      
      <div>
        <h2>Agregar Libro</h2>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del Libro"
          value={bookDetails.nombre}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="editorial"
          placeholder="Editorial"
          value={bookDetails.editorial}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="autor"
          placeholder="Nombre del Autor"
          value={bookDetails.autor}
          onChange={handleInputChange}
        />
        <select name="genero_id" value={bookDetails.genero_id} onChange={handleInputChange}>
          <option value="">Seleccione un género</option>
          {generos.map((genero) => (
            <option key={genero.id} value={genero.id}>{genero.nombre}</option>
          ))}
        </select>
        <select name="subgenero_id" value={bookDetails.subgenero_id} onChange={handleInputChange}>
          <option value="">Seleccione un subgénero</option>
          {subgeneros.map((subgenero) => (
            <option key={subgenero.id} value={subgenero.id}>{subgenero.nombre}</option>
          ))}
        </select>
        <select name="ano" value={bookDetails.ano} onChange={handleInputChange}>
          <option value="">Seleccione un año</option>
          {Array.from({ length: 2025 - 1900 + 1 }, (_, i) => 1900 + i).map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <input
          type="text"
          name="ISBN"
          placeholder="ISBN"
          value={bookDetails.ISBN}
          onChange={handleInputChange}
        />
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={bookDetails.descripcion}
          onChange={handleInputChange}
        />
        <input
          type="file"
          name="imagen"
          accept="image/*"
          onChange={handleImageChange}
        />
        <select name="estado" value={bookDetails.estado} onChange={handleInputChange}>
          <option value="disponible">Disponible</option>
          <option value="reservado">Reservado</option>
        </select>
        {editingBookId ? (
          <button onClick={handleUpdateBook}>Actualizar Libro</button>
        ) : (
          <button onClick={handleAddBook}>Agregar Libro</button>
        )}
      </div>

      <div>
        <h2>Gestionar Géneros</h2>
        <input
          type="text"
          value={newGenero}
          onChange={(e) => setNewGenero(e.target.value)}
          placeholder="Nuevo Género"
        />
        <button onClick={handleAddGenero}>Agregar Género</button>
        <ul>
          {generos.map((genero) => (
            <li key={genero.id}>
              {genero.nombre}
              <button onClick={() => handleDeleteGenero(genero.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Gestionar Subgéneros</h2>
        <input
          type="text"
          value={newSubgenero}
          onChange={(e) => setNewSubgenero(e.target.value)}
          placeholder="Nuevo Subgénero"
        />
        <button onClick={handleAddSubgenero}>Agregar Subgénero</button>
        <ul>
          {subgeneros.map((subgenero) => (
            <li key={subgenero.id}>
              {subgenero.nombre}
              <button onClick={() => handleDeleteSubgenero(subgenero.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Lista de Libros</h2>
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              {book.imagen && (
                <img src={`http://localhost:3001/images/${book.imagen}`} alt={book.nombre} width="100" />
              )}
              {book.nombre} - {book.editorial} - {book.autor} - {book.genero_id} - {book.subgenero_id} - {book.ano} - {book.ISBN} - {book.descripcion} - {book.estado}
              <button onClick={() => handleEditBook(book)}>Editar</button>
              <button onClick={() => handleDeleteBook(book.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Gestionar Reservas</h2>
        <select name="book_id" value={reservaDetails.book_id || ''} onChange={(e) => setReservaDetails({ ...reservaDetails, book_id: e.target.value })}>
          <option value="">Seleccione un libro</option>
          {books.map((book) => (
             <option key={book.id} value={book.id}>{book.nombre}</option>
            ))}
          </select>
          <DatePicker
            selected={reservaDetails.fecha_inicio}
            onChange={(date) => handleReservaChange(date, 'fecha_inicio')}
            selectsStart
            startDate={reservaDetails.fecha_inicio}
            endDate={reservaDetails.fecha_fin}
            placeholderText="Fecha de inicio"
          />
          <DatePicker
            selected={reservaDetails.fecha_fin}
            onChange={(date) => handleReservaChange(date, 'fecha_fin')}
            selectsEnd
            startDate={reservaDetails.fecha_inicio}
            endDate={reservaDetails.fecha_fin}
            placeholderText="Fecha de fin"
          />
          <button onClick={handleAddReserva}>Agregar Reserva</button>
          <ul>
            {reservas.map((reserva) => (
              <li key={reserva.id}>
                Libro ID: {reserva.book_id} - Desde: {new Date(reserva.fecha_inicio).toLocaleDateString()} - Hasta: {new Date(reserva.fecha_fin).toLocaleDateString()} - Estado: {reserva.estado}
                <button onClick={() => handleDeleteReserva(reserva.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  
  export default AdminPage;