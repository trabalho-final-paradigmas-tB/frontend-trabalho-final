import React from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css'

const Home = () => {

  const navigate = useNavigate();
  const goToHeroesPage = () => {
    navigate('/heroi');
  };
  const goToSimulatorPage = () => {
    navigate('/simulador');
  }
  const goToMissoesPage = () => {
    navigate('/missao');
  }
  const goToCrimesPage = () => {
    navigate('/crimes');
  }

  return (
    <div className='Home'>
      <h1>Bem-vindo ao Composto V</h1>
      <p className='paragrafo'>
      Sua entrada no universo dos "supers". Crie e acompanhe heróis com detalhes reveladores — habilidades, reputação e segredos sombrios. No simulador de batalhas, veja quem realmente é o herói, onde poder e popularidade se enfrentam.
      </p>
      <div className='butoesMainpage'>
        <p>Clique em um dos botões</p>
        <button onClick={goToHeroesPage}>Heróis</button>
        <button onClick={goToMissoesPage}>Missões</button>
        <button onClick={goToCrimesPage}>Crimes</button>
        <button onClick={goToSimulatorPage}>Simulador</button>
      </div>
    </div>
  );
};

export default Home;