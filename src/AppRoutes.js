import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Hero from './hero'; // Ajuste o caminho conforme necessário
import Home from './home'; // Importe a nova página inicial
import Simulador from './simulador'
import Missoes from './missoes';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} /> {/* Página inicial */}
      <Route path="/heroi" element={<Hero />} />
      <Route path="/simulador" element={<Simulador/>} />
      <Route path="/missoes" element={<Missoes/>} />
      {/* Defina outras rotas aqui */}
    </Routes>
  );
};

export default AppRoutes;
