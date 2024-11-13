import React from 'react';
import './heroDetails.css'

function HeroDetails({ hero }) {
  const handleDelete = async () => {
    try {
      const response = await fetch(`/heroi/${hero.codigo_heroi}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert(`Herói ${hero.nome_heroi} deletado com sucesso.`);
        window.location.reload();
      } else {
        alert("Erro ao deletar o herói.");
      }
    } catch (error) {
      console.error("Erro na requisição DELETE:", error);
      alert("Erro ao tentar deletar o herói.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className='infoHero'>
      <h1 className='titleHero'>{hero.nome_heroi}</h1>
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
      <p><strong>Data de Nascimento:</strong> {formatDate(hero.data_nascimento)}</p>
      <button className='deleteButton' onClick={handleDelete}>Deletar Herói</button>
      <button className='editButton'>Editar Herói</button>
    </div>
  );
}

export default HeroDetails;
