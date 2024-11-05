import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Hero from './hero'; // Ajuste o caminho conforme necessário
import Home from './home'; // Importe a nova página inicial

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} /> {/* Página inicial */}
      <Route path="/hero" element={<Hero />} />
      {/* Defina outras rotas aqui */}
    </Routes>
  );
};

export default AppRoutes;
