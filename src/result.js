import React from 'react';
import { useLocation } from 'react-router-dom';
import './result.css';

const Result = () => {
  const location = useLocation();
  const { resultados, vencedor } = location.state.batalharesultado || {};

  console.log("Dados recebidos na página de resultados:", resultados, vencedor);

  if (!resultados || resultados.length === 0) {
    return <div>Nenhum dado de batalha disponível</div>;
  }

  return (
    <div className='Result'>
      <h1>Resultado da Batalha</h1>
      {resultados.map((turnoData, index) => (
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
      <div className='vencedor'>
        <h2>Vencedor da Batalha: {vencedor}</h2>
      </div>
    </div>
  );
};

export default Result;
