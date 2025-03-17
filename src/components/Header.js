import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <h1>Biblioteca Pública</h1>
      <nav>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/catalog">Catálogo</Link></li>
          <li><Link to="/cart">Carrito</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;