import './hero.css';
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

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

  const handleHeroClick = (hero) => {
    setSelectedHero(hero);
  };

  const handleClose = () => {
    setSelectedHero(null);
  };

  const handleEditHero = () => {
    // Implementar a lógica de edição do herói
    console.log('Editar herói:', selectedHero);
  };

  const handleDeleteHero = () => {
    // Implementar a lógica de exclusão do herói
    console.log('Deletar herói:', selectedHero);
  };

  return (
    <div className="Hero">
      <div className="mainPage">
        <h1>Heróis</h1>
        <p className='textoHeroPage'>Nesta página é possível fazer adição, remoção, atualização e consulta de heróis no banco de dados.</p>
        <div className="hero-container">
          {heroes.length > 0 ? (
            heroes.map((hero) => (
              <div
                key={hero.codigo_heroi}
                className="hero-item"
                onClick={() => handleHeroClick(hero)}
              >
                <div className="hero-name">{hero.nome_heroi}</div>
              </div>
            ))
          ) : (
            <p>Nenhum herói encontrado.</p>
          )}
        </div>
      </div>

      {/* Dialog para mostrar os detalhes do herói */}
      {selectedHero && (
        <Dialog className='dialog' open={Boolean(selectedHero)} onClose={handleClose}>
          <DialogTitle className='titleDialog'>Detalhes do Herói</DialogTitle>
          <DialogContent className='conteudoDialog'>
            <p><strong>Nome Real: </strong>{selectedHero.nome_real}</p>
            <p><strong>Nome de Herói: </strong>{selectedHero.nome_heroi}</p>
            <p><strong>Sexo:</strong> {selectedHero.sexo}</p>
            <p><strong>Altura:</strong> {selectedHero.altura_heroi} m</p>
            <p><strong>Peso:</strong> {selectedHero.peso_heroi} kg</p>
            <p><strong>Local de Nascimento:</strong> {selectedHero.local_nascimento}</p>
            <p><strong>Poderes:</strong> {selectedHero.poderes}</p>
            <p><strong>Nível de Força:</strong> {selectedHero.nivel_forca}</p>
            <p><strong>Popularidade:</strong> {selectedHero.popularidade}</p>
            <p><strong>Status:</strong> {selectedHero.status}</p>
            <p><strong>Histórico de Batalhas:</strong> {selectedHero.historico_batalhas}</p>
            <p><strong>Data de Nascimento:</strong> {new Date(selectedHero.data_nascimento).toLocaleDateString()}</p>
          </DialogContent>
          <DialogActions className='butoesDialog'>
            <Button onClick={handleClose} sx={{ color: 'white' }}>Fechar</Button>
            <Button onClick={handleEditHero} sx={{ color: 'white' }}>Editar</Button>
            <Button onClick={handleDeleteHero} sx={{ color: 'white' }}>Deletar</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

export default Hero;
