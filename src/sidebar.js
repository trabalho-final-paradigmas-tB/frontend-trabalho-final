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
    navigate('/hero');
  };

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : ''}`}>
      <img src="/assets/logoTheBoys.png" alt="The Boys Logo" className="sidebar-logo" />
      <ul className="sidebar-menu">
        <li onClick={toggleSidebar}>
          <img src="/assets/menuOpen.png" alt="Abrir-menu" className="abrir-menu" style={{ width: '25px', height: '25px' }} />
        </li>
        <li onClick={goToHeroesPage}>
          <img src="/assets/superhero 1.png" alt="Heróis" />
          {isExpanded && <span>Heróis</span>}
        </li>
        <li>
          <img src="/assets/target 1.png" alt="Missões" />
          {isExpanded && <span>Missões</span>}
        </li>
        <li>
          <img src="/assets/prisoner 1.png" alt="Crimes" />
          {isExpanded && <span>Crimes</span>}
        </li>
        <li>
          <img src="/assets/swords.png" alt="Simulador" />
          {isExpanded && <span>Simulador</span>}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
