import './hero.css';
import React, { useState, useEffect, useCallback } from 'react';
import { Drawer, Button, TextField, IconButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HeroDetails from './HeroDetais.js';

function Hero() {
  const [heroes, setHeroes] = useState([]);
  const [filteredHeroes, setFilteredHeroes] = useState([]); // Correção na desestruturação
  const [selectedHero, setSelectedHero] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    nome: '',
    status: '',
    popularidade: '',
  });
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
    data_nascimento: '',
  });

  useEffect(() => {
    fetchHeroes();
  }, []);

  useEffect(() => {
    filterHeroes();
  }, [filters, heroes]);

  const fetchHeroes = async () => {
    try {
      const response = await fetch('/heroi');
      const data = await response.json();
      setHeroes(data);
    } catch (error) {
      console.error('Erro ao buscar heróis:', error);
    }
  };

  const filterHeroes = useCallback(() => {
    const { nome, status, popularidade } = filters;
    const filtered = heroes.filter((hero) =>
      (!nome || hero.nome_heroi.toLowerCase().includes(nome.toLowerCase())) &&
      (!status || hero.status === status) &&
      (!popularidade || hero.popularidade >= parseInt(popularidade, 10))
    );
    setFilteredHeroes(filtered); // Atualizando o estado corretamente
  }, [filters, heroes]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleHeroClick = (hero) => {
    setSelectedHero(hero);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setSelectedHero(null);
    setDrawerOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHero((prevHero) => ({
      ...prevHero,
      [name]: 
        name === 'altura_heroi' || name === 'peso_heroi'
          ? parseFloat(value)
          : name === 'nivel_forca' || name === 'popularidade'
          ? parseInt(value, 10)
          : value,
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

      if (response.ok) {
        fetchHeroes();
        setNewHero({
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
          data_nascimento: '',
        });
        setDrawerOpen(false);
      } else {
        console.error('Erro ao inserir o herói');
      }
    } catch (error) {
      console.error('Erro ao inserir o herói:', error);
    }
  };

  return (
    <div className="Hero">
      <h1>Heróis</h1>
      <p className='infoPage'>Aqui é possível consultar, adicionar, remover ou atualizar heróis do banco de dados</p>
      <div className="filters">
        <p>Filtros:</p>
        <TextField
          label="Buscar por Nome"
          name="nome"
          value={filters.nome}
          onChange={handleFilterChange}
          fullWidth
          className="text-field"
        />
        <FormControl fullWidth className="text-field">
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="Ativo">Ativo</MenuItem>
            <MenuItem value="Inativo">Inativo</MenuItem>
            <MenuItem value="Banido">Banido</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Popularidade Mínima"
          name="popularidade"
          value={filters.popularidade}
          onChange={handleFilterChange}
          type="number"
          fullWidth
          className="text-field"
        />
      </div>
      <Button className='butaoAdd' variant="contained" color="primary" onClick={() => setDrawerOpen(true)}>
        Adicionar Herói
      </Button>
      <div className="hero-container">
        <p className="pContainerHeroi">Lista dos heróis registrados</p>
        {filteredHeroes.length > 0 ? (
          filteredHeroes.map((hero) => (
            <div
              key={hero.codigo_heroi}
              className="hero-item"
              onClick={() => handleHeroClick(hero)}
            >
              <div className="hero-name">{hero.nome_heroi}</div>
            </div>
          ))
        ) : (
          <p className="nadaEncontrado">Nenhum herói encontrado.</p>
        )}
      </div>

      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
        <div className='draw' style={{ width: '700px', padding: '50px' }}>
          <IconButton onClick={handleDrawerClose} style={{ marginBottom: '20px' }}>
            <CloseIcon />
          </IconButton>
          {selectedHero ? (
            <HeroDetails hero={selectedHero} onClose={handleDrawerClose} />
          ) : (
            <>
              <h2>Adicionar Novo Herói</h2>
              <div className='seletoresInserir'>
                <TextField label="Nome Real" name="nome_real" value={newHero.nome_real} onChange={handleInputChange} fullWidth className="text-field"/>
                <TextField label="Nome de Herói" name="nome_heroi" value={newHero.nome_heroi} onChange={handleInputChange} fullWidth className="text-field"/>
                
                <FormControl fullWidth className="text-field">
                  <InputLabel>Sexo</InputLabel>
                  <Select
                    name="sexo"
                    value={newHero.sexo}
                    onChange={handleInputChange}
                    label="Sexo"
                  >
                    <MenuItem value="M">Masculino</MenuItem>
                    <MenuItem value="F">Feminino</MenuItem>
                  </Select>
                </FormControl>

                <TextField label="Altura (cm)" name="altura_heroi" value={newHero.altura_heroi} onChange={handleInputChange} type='number' fullWidth className="text-field"/>
                <TextField label="Peso (kg)" name="peso_heroi" value={newHero.peso_heroi} onChange={handleInputChange} type="number" fullWidth className="text-field"/>
                <TextField label="Local de Nascimento" name="local_nascimento" value={newHero.local_nascimento} onChange={handleInputChange} fullWidth className="text-field"/>
                <TextField label="Poderes" name="poderes" value={newHero.poderes} onChange={handleInputChange} fullWidth className="text-field"/>
                <TextField label="Nível de Força" name="nivel_forca" value={newHero.nivel_forca} onChange={handleInputChange} type='number' fullWidth className="text-field"/>
                <TextField label="Popularidade" name="popularidade" value={newHero.popularidade} onChange={handleInputChange} type='number' fullWidth className="text-field"/>

                <FormControl fullWidth className="text-field">
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={newHero.status}
                    onChange={handleInputChange}
                    label="Status"
                  >
                    <MenuItem value="Ativo">Ativo</MenuItem>
                    <MenuItem value="Inativo">Inativo</MenuItem>
                    <MenuItem value="Banido">Banido</MenuItem>
                  </Select>
                </FormControl>
                <TextField label="Data de Nascimento" name="data_nascimento" value={newHero.data_nascimento} onChange={handleInputChange} InputLabelProps={{ shrink: true }} type="date" fullWidth className="text-field"/>
              </div>
              <Button variant="contained" color="primary" onClick={handleInsertHero} fullWidth>
                Inserir Herói
              </Button>
            </>
          )}
        </div>
      </Drawer>
    </div>
  );
}

export default Hero;
