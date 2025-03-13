import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

function CatalogPage() {
  const [userInfo, setUserInfo] = useState({ ci: '', nombre: '', apellido: '', edad: '' });
  const [cart, setCart] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [books, setBooks] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:3001/books');
        setBooks(response.data);
      } catch (e) {
        console.error("Error obteniendo libros: ", e);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const storedReservations = JSON.parse(localStorage.getItem('reservations'));
    if (storedReservations) {
      setReservations(storedReservations);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('reservations', JSON.stringify(reservations));
  }, [reservations]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const addToCart = (book) => {
    if (cart.length >= 5) {
      alert('No puedes agregar más de 5 libros al carrito.');
      return;
    }
    setCart([...cart, book]);
  };

  const handleReserve = () => {
    if (cart.length === 0) {
      alert('El carrito está vacío.');
      return;
    }

    if (!userInfo.ci || !userInfo.nombre || !userInfo.apellido || !userInfo.edad) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const newReservations = cart.map((book) => ({ ...userInfo, book, date: new Date().toLocaleDateString() }));
    setReservations([...reservations, ...newReservations]);
    setCart([]);
    alert('Libros reservados exitosamente.');
  };

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  return (
    <div>
      <h1>Catálogo de Libros</h1>
      <button onClick={toggleCart} className="cart-button">
        <i className="fas fa-shopping-cart"></i> ({cart.length})
      </button>
      {showCart && (
        <div className="cart">
          <h2>Carrito de Reservas</h2>
          <ul>
            {cart.map((book, index) => (
              <li key={index}>{book.nombre}</li>
            ))}
          </ul>
          <button onClick={handleReserve}>Reservar Libros</button>
        </div>
      )}
      <ul>
        {books.map((book, index) => (
          <li key={index}>
            {book.nombre} por {book.autor} ({book.editorial}) - {book.genero}/{book.subgenero} - {book.ano}
            <button onClick={() => addToCart(book)}>Agregar al Carrito</button>
          </li>
        ))}
      </ul>
      <div>
        <h2>Información del Usuario</h2>
        <input
          type="text"
          name="ci"
          placeholder="CI"
          value={userInfo.ci}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={userInfo.nombre}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={userInfo.apellido}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="edad"
          placeholder="Edad"
          value={userInfo.edad}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <h2>Libros Reservados</h2>
        <ul>
          {reservations.map((reservation, index) => (
            <li key={index}>
              {reservation.book.nombre} - Reservado por {reservation.nombre} {reservation.apellido} ({reservation.ci}) el {reservation.date}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CatalogPage;