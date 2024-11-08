import './hero.css';
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

function Hero() {
  const [heroes, setHeroes] = useState([]);
  const [selectedHero, setSelectedHero] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newHero, setNewHero] = useState({
    nome_real: '',
    nome_heroi: '',
    sexo: '',
    altura_heroi: '',
    peso_heroi: '',
    local_nascimento: '',
    poderes: '',
    nivel_forca: '',
    popularidade: '',
    status: '',
    historico_batalhas: '',
    data_nascimento: '',
  });

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
    setOpenDialog(true);
  };

  const handleClose = () => {
    setSelectedHero(null);
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHero((prevHero) => ({
      ...prevHero,
      [name]: name === 'altura_heroi' || name === 'peso_heroi' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleInsertHero = async () => {
    try {
      const response = await fetch('/heroi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newHero),
      });
  
      if (!response.ok) {
        throw new Error('Erro ao inserir herói');
      }
      
      // Atualize a lista de heróis
      const newHeroData = await response.json();
      setHeroes((prevHeroes) => [...prevHeroes, newHeroData]);
      handleClose();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEditHero = async () => {
    try {
      const response = await fetch(`/heroi/${selectedHero.codigo_heroi}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedHero),
      });

      if (!response.ok) {
        throw new Error('Erro ao editar herói');
      }

      const updatedHero = await response.json();
      setHeroes((prevHeroes) =>
        prevHeroes.map((hero) =>
          hero.codigo_heroi === updatedHero.codigo_heroi ? updatedHero : hero
        )
      );
      handleClose();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDeleteHero = async () => {
    if (!selectedHero || !selectedHero.codigo_heroi) {
      console.error("ID inválido para exclusão");
      return;
    }
    try {
      const response = await fetch(`/heroi/${selectedHero.codigo_heroi}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Erro ao deletar herói');
      }
      setHeroes(heroes.filter(hero => hero.codigo_heroi !== selectedHero.codigo_heroi));
      handleClose();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="Hero">
      <div className="mainPage">
        <h1>Heróis</h1>
        <p className='textoHeroPage'>Nesta página é possível fazer adição, remoção, atualização e consulta de heróis no banco de dados.</p>
        <button className='botaoAdd' onClick={() => setOpenDialog(true)}>Adicionar Herói</button>
        <div className="hero-container">
          <p className='pContainerHeroi'>Lista dos heróis registrados</p>
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
            <p className='nadaEncontrado'>Nenhum herói encontrado.</p>
          )}
        </div>
      </div>

      <Dialog className='dialog' open={openDialog} onClose={handleClose}>
        <DialogTitle className='titleDialog'>
          {selectedHero ? `Informações do Herói: ${selectedHero.nome_heroi}` : 'Adicionar Novo Herói'}
        </DialogTitle>
        <DialogContent className='conteudoDialog'>
          {selectedHero ? (
            <div>
              <p><strong>Nome Real:</strong> {selectedHero.nome_real}</p>
              <p><strong>Sexo:</strong> {selectedHero.sexo}</p>
              <p><strong>Altura:</strong> {selectedHero.altura_heroi} m</p>
              <p><strong>Peso:</strong> {selectedHero.peso_heroi} kg</p>
              <p><strong>Local de Nascimento:</strong> {selectedHero.local_nascimento}</p>
              <p><strong>Poderes:</strong> {selectedHero.poderes}</p>
              <p><strong>Nível de Força:</strong> {selectedHero.nivel_forca}</p>
              <p><strong>Popularidade:</strong> {selectedHero.popularidade}</p>
              <p><strong>Status:</strong> {selectedHero.status}</p>
              <p><strong>Histórico de Batalhas:</strong> {selectedHero.historico_batalhas}</p>
              <p><strong>Data de Nascimento:</strong> {selectedHero.data_nascimento}</p>
            </div>
          ) : (
            <>
              <TextField label="Nome Real" name="nome_real" value={newHero.nome_real} onChange={handleInputChange} fullWidth />
              <TextField label="Nome de Herói" name="nome_heroi" value={newHero.nome_heroi} onChange={handleInputChange} fullWidth />
              <TextField label="Sexo" name="sexo" value={newHero.sexo} onChange={handleInputChange} fullWidth />
              <TextField label="Altura (m)" name="altura_heroi" value={newHero.altura_heroi} onChange={handleInputChange} type="number" fullWidth />
              <TextField label="Peso (kg)" name="peso_heroi" value={newHero.peso_heroi} onChange={handleInputChange} type="number" fullWidth />
              <TextField label="Local de Nascimento" name="local_nascimento" value={newHero.local_nascimento} onChange={handleInputChange} fullWidth />
              <TextField label="Poderes" name="poderes" value={newHero.poderes} onChange={handleInputChange} fullWidth />
              <TextField label="Nível de Força" name="nivel_forca" value={newHero.nivel_forca} onChange={handleInputChange} fullWidth />
              <TextField label="Popularidade" name="popularidade" value={newHero.popularidade} onChange={handleInputChange} fullWidth />
              <TextField label="Status" name="status" value={newHero.status} onChange={handleInputChange} fullWidth />
              <TextField label="Histórico de Batalhas" name="historico_batalhas" value={newHero.historico_batalhas} onChange={handleInputChange} fullWidth />
              <TextField label="Data de Nascimento" name="data_nascimento" value={newHero.data_nascimento} onChange={handleInputChange} type="date" fullWidth />
            </>
          )}
        </DialogContent>
        <DialogActions className='butoesDialog'>
          <Button onClick={handleClose} sx={{ color: 'white' }}>Cancelar</Button>
          {selectedHero ? (
            <>
              <Button onClick={handleEditHero} sx={{ color: 'white' }}>Editar</Button>
              <Button onClick={handleDeleteHero} sx={{ color: 'white' }}>Deletar</Button>
            </>
          ) : (
            <Button onClick={handleInsertHero} sx={{ color: 'white' }}>Inserir</Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Hero;
