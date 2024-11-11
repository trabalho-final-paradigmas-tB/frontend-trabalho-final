import React from 'react';

function HeroDetails({ hero }) {
  return (
    <div>
      <h2>Informações do Herói: {hero.nome_heroi}</h2>
      <p><strong>Nome Real:</strong> {hero.nome_real}</p>
      <p><strong>Sexo:</strong> {hero.sexo}</p>
      <p><strong>Altura:</strong> {hero.altura_heroi} cm</p>
      <p><strong>Peso:</strong> {hero.peso_heroi} kg</p>
      <p><strong>Local de Nascimento:</strong> {hero.local_nascimento}</p>
      <p><strong>Poderes:</strong> {hero.poderes}</p>
      <p><strong>Nível de Força:</strong> {hero.nivel_forca}</p>
      <p><strong>Popularidade:</strong> {hero.popularidade}</p>
      <p><strong>Status:</strong> {hero.status}</p>
      <p><strong>Histórico de Batalhas:</strong> {hero.historico_batalhas}</p>
      <p><strong>Data de Nascimento:</strong> {hero.data_nascimento}</p>
    </div>
  );
}

export default HeroDetails;
