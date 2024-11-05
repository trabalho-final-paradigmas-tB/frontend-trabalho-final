import React from 'react';
import './hero.css'

function Hero() {
    return (
      <div className="Hero">
        <h1>Heróis</h1>
        <p>Nesta página é possível fazer adição, remoção, atualização e consulta de heróis no banco de dados.</p>
        <div className="butoes">
            <button>Inserir</button>
            <button>Consultar</button>
            <button>Remover</button>
            <button>Atualizar</button>
        </div>
      </div>
    );
  }
  
  export default Hero;
  