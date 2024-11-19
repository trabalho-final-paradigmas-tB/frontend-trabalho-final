import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Hero from './hero'; 
import Home from './home'; 
import Simulador from './simulador'
import Missoes from './missoes';
import Crimes from './crimes';
import Resultados from './result'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} /> 
      <Route path="/heroi" element={<Hero />} />
      <Route path="/simulador" element={<Simulador/>} />
      <Route path="/missao" element={<Missoes/>} />
      <Route path="/crimes" element={<Crimes/>} />
      <Route path="/resultado" element={<Resultados/>}/>
    </Routes>
  );
};

export default AppRoutes;
