import React from 'react';
import { useLocation } from 'react-router-dom';
import './result.css';

const Result = () => {
  const location = useLocation();
  const { batalharesultado } = location.state || {};

  console.log("Dados recebidos na página de resultados:", batalharesultado);

  if (!batalharesultado || batalharesultado.length === 0) {
    return <div>Nenhum dado de batalha disponível</div>;
  }

  return (
    <div className='Result'>
      <h1>Resultado da Batalha</h1>
      {batalharesultado.map((turnoData, index) => (
        <div key={index} className='turno'>
          <h2>Turno {index + 1}</h2>
          {turnoData.turnos.map((heroi, idx) => (
            <div key={idx} className='hero'>
              <h3>{heroi.Nome}</h3>
              <p>Vida: {heroi.Vida}</p>
              <p>Poder Usado: {heroi.PoderUsado}</p>
              <p>Popularidade Atual: {heroi.PopularidadeAtual}</p>
            </div>
          ))}
          {turnoData.evento && <p><strong>Evento:</strong> {turnoData.evento}</p>}
          {turnoData.consequencias && <p><strong>Consequências:</strong> {turnoData.consequencias}</p>}
        </div>
      ))}
    </div>
  );
};

export default Result;
