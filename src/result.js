import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './result.css';

const Result = () => {
  const { battleId } = useParams();
  const [battleData, setBattleData] = useState(null);

  useEffect(() => {
    // Substitua pela sua função de busca dos dados da batalha
    fetch(`/api/battles/${battleId}`)
      .then((response) => response.json())
      .then((data) => setBattleData(data))
      .catch((error) => console.error('Erro ao buscar dados da batalha:', error));
  }, [battleId]);

  if (!battleData) {
    return <div>Carregando...</div>;
  }

  return (
    <div className='Result'>
      <h1>Resultado da Batalha</h1>
      <div className='heroes'>
        <div className='hero'>
          <h2>{battleData.hero1.name}</h2>
          <p>Força: {battleData.hero1.strength}</p>
          <p>Velocidade: {battleData.hero1.speed}</p>
          <p>Inteligência: {battleData.hero1.intelligence}</p>
          <p>Dano Causado: {battleData.hero1.damageDealt}</p>
          <p>Dano Recebido: {battleData.hero1.damageTaken}</p>
        </div>
        <div className='hero'>
          <h2>{battleData.hero2.name}</h2>
          <p>Força: {battleData.hero2.strength}</p>
          <p>Velocidade: {battleData.hero2.speed}</p>
          <p>Inteligência: {battleData.hero2.intelligence}</p>
          <p>Dano Causado: {battleData.hero2.damageDealt}</p>
          <p>Dano Recebido: {battleData.hero2.damageTaken}</p>
        </div>
      </div>
      <h2>Vencedor: {battleData.winner}</h2>
    </div>
  );
};

export default Result;
