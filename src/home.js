import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const navigate = useNavigate();
  const goToHeroesPage = () => {
    navigate('/hero');
  };

  return (
    <div className='Home'>
      <h1>Bem-vindo ao Composto V</h1>
      <p className='paragrafo'>
        Composto V é uma API poderosa que oferece controle total sobre um universo de "supers", permitindo a criação, gerenciamento e monitoramento de heróis e suas ações. 
        Inspirada no universo sombrio de The Boys, a API fornece acesso aos detalhes e segredos dos heróis, incluindo suas características, reputação, crimes e missões. 
        Com o simulador de batalhas, usuários podem visualizar combates realistas que consideram força, popularidade e até o apoio público, revelando o verdadeiro lado dos heróis.
      </p>
      <div className='butoesMainpage'>
        <button onClick={goToHeroesPage}>Heróis</button>
        <button>Missões</button>
        <button>Crimes</button>
        <button>Simulador</button>
      </div>
    </div>
  );
};

export default Home;