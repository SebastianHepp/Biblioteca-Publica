import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';
import Header from './components/Header';

function App() {
  const [catalog, setCatalog] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAddBook = (newBook) => {
    setCatalog([...catalog, newBook]);
  };

  const handleLogin = (authStatus) => {
    setIsAuthenticated(authStatus);
  };

  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage catalog={catalog} />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route
            path="/admin"
            element={
              isAuthenticated ? (
                <AdminPage onAddBook={handleAddBook} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;