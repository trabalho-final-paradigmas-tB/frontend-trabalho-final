import './hero.css';
import React, { useState, useEffect } from 'react';

function Hero() {
  const [heroes, setHeroes] = useState([]);

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const response = await fetch('/heroi');
        const data = await response.json();
        setHeroes(data);
      } catch (error) {
        console.error('Erro ao buscar heróis:', error);
      }
    };
    fetchHeroes();
  }, []);

  return (
    <div className="Hero">
      <h1>Heróis</h1>
      <p>Nesta página é possível fazer adição, remoção, atualização e consulta de heróis no banco de dados.</p>
      <div className="hero-container">
        {heroes.length > 0 ? (
          heroes.map((hero) => (
            <div key={hero.codigo_heroi} className="hero-item">
              {hero.nome_heroi}
            </div>
          ))
        ) : (
          <p>Nenhum herói encontrado.</p>
        )}
      </div>
    </div>
  );
}

export default Hero;
