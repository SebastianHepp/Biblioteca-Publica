import React from 'react';
import '../css/HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <h1>Bienvenido a la Biblioteca</h1>
      <p>Explora nuestro catálogo de libros y reserva tus favoritos.</p>
      <button onClick={() => window.location.href='/catalog'}>Ir al Catálogo</button>
    </div>
  );
}

export default HomePage;