import React, { useState } from 'react';
import axios from 'axios';

function AdminPage() {
  const [bookDetails, setBookDetails] = useState({
    nombre: '',
    editorial: '',
    autor: '',
    genero: '',
    subgenero: '',
    ano: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookDetails({ ...bookDetails, [name]: value });
  };

  const handleAddBook = async () => {
    if (!bookDetails.nombre || !bookDetails.editorial || !bookDetails.autor || !bookDetails.genero || !bookDetails.subgenero || !bookDetails.ano) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/addBook', bookDetails);
      console.log("Libro agregado con ID: ", response.data.id);
      alert('Libro agregado exitosamente.');
    } catch (e) {
      console.error("Error añadiendo libro: ", e);
      alert('Error añadiendo libro.');
    }

    setBookDetails({
      nombre: '',
      editorial: '',
      autor: '',
      genero: '',
      subgenero: '',
      ano: ''
    });
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
        <input
          type="text"
          name="genero"
          placeholder="Género"
          value={bookDetails.genero}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="subgenero"
          placeholder="Sub-Género"
          value={bookDetails.subgenero}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="ano"
          placeholder="Año de Publicación"
          value={bookDetails.ano}
          onChange={handleInputChange}
        />
        <button onClick={handleAddBook}>Agregar Libro</button>
      </div>
    </div>
  );
}

export default AdminPage;