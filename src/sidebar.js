import './sidebar.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const goToHeroesPage = () => {
    navigate('/heroi');
  };

  const goToHomePage = () => {
    navigate('/');
  };

  const goToSimulatorPage = () => {
    navigate('/simulador');
  }

  const goToMissoesPage = () => {
    navigate('/missao');
  }

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : ''}`}>
      <img src="/assets/logoTheBoys.png" alt="The Boys Logo" className="sidebar-logo" onClick={goToHomePage}/>
      <ul className="sidebar-menu">
        <li onClick={toggleSidebar}>
          <img src="/assets/menuOpen.png" alt="Abrir-menu" className="abrir-menu" style={{ width: '25px', height: '25px' }} />
        </li>
        <li onClick={goToHeroesPage}>
          <img src="/assets/superhero.png" alt="Heróis" />
          {isExpanded && <span onClick={goToHeroesPage}>Heróis</span>}
        </li>
        <li onClick={goToMissoesPage}>
          <img src="/assets/target.png" alt="Missões" />
          {isExpanded && <span onClick={goToMissoesPage}>Missões</span>}
        </li>
        <li>
          <img src="/assets/prisoner.png" alt="Crimes" />
          {isExpanded && <span>Crimes</span>}
        </li>
        <li onClick={goToSimulatorPage}>
          <img src="/assets/swords.png" alt="Simulador" />
          {isExpanded && <span onClick={goToSimulatorPage}>Simulador</span>}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
