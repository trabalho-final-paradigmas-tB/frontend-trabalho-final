import React from 'react';
import './sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <img src="/assets/logoTheBoys.png" alt="The Boys Logo" className="sidebar-logo" />
      <ul className='sidebar-menu'>
        <li>
          <img src="/assets/menuOpen.png" alt="Abrir-menu" className='abrir-menu' />
        </li>
        <li>
          <img src="/assets/superhero 1.png" alt="Heróis" />
        </li>
        <li>
          <img src="/assets/target 1.png" alt="Missões" />
        </li>
        <li>
          <img src="/assets/prisoner 1.png" alt="Crimes" />
        </li>
        <li>
          <img src="/assets/swords.png" alt="Simulador" />
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;