import './hero.css';
import React, { useState, useEffect } from 'react';

function Hero() {
  const [heroes, setHeroes] = useState([]);
  const [selectedHero, setSelectedHero] = useState(null);

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

  const handleHeroClick = (heroId) => {
    setSelectedHero(selectedHero === heroId ? null : heroId);
  };

  return (
    <div className="Hero">
      <div className="mainPage">
        <h1>Heróis</h1>
        <p>Nesta página é possível fazer adição, remoção, atualização e consulta de heróis no banco de dados.</p>
        <div className="hero-container">
          {heroes.length > 0 ? (
            heroes.map((hero) => (
              <div
                key={hero.codigo_heroi}
                className={`hero-item ${selectedHero === hero.codigo_heroi ? 'expanded' : ''}`}
                onClick={() => handleHeroClick(hero.codigo_heroi)}
              >
                <div className="hero-name">{hero.nome_heroi}</div>
                {selectedHero === hero.codigo_heroi && (
                  <div className="hero-details">
                    <p>Nome Real: {hero.nome_real}</p>
                    <p>Sexo: {hero.sexo}</p>
                    <p>Altura: {hero.altura_heroi} m</p>
                    <p>Peso: {hero.peso_heroi} kg</p>
                    <p>Local de Nascimento: {hero.local_nascimento}</p>
                    <p>Poderes: {hero.poderes}</p>
                    <p>Nível de Força: {hero.nivel_forca}</p>
                    <p>Popularidade: {hero.popularidade}</p>
                    <p>Status: {hero.status}</p>
                    <p>Histórico de Batalhas: {hero.historico_batalhas}</p>
                    <p>Data de Nascimento: {new Date(hero.data_nascimento).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>Nenhum herói encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Hero;
