import React, { useState } from "react";
import "./heroDetails.css";

function HeroDetails({ hero }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedHero, setEditedHero] = useState({ ...hero });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedHero({ ...editedHero, [name]: value });
  };

  const formattedHero = {
    ...editedHero,
    altura_heroi: parseFloat(editedHero.altura_heroi),
    peso_heroi: parseFloat(editedHero.peso_heroi),
    nivel_forca: parseInt(editedHero.nivel_forca, 10),
    popularidade: parseInt(editedHero.popularidade, 10),
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
        `Tem certeza de que deseja deletar o herói ${hero.nome_heroi}?`
    );

    if (!confirmDelete) {
        return;
    }

    try {
        const response = await fetch(`/heroi/${hero.codigo_heroi}`, {
            method: "DELETE",
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

const handleEdit = async () => {
  const confirmEdit = window.confirm(
      `Tem certeza de que deseja salvar as alterações feitas no herói ${editedHero.nome_heroi}?`
  );

  if (!confirmEdit) {
      return; // Se o usuário cancelar, interrompe a execução
  }

  try {
      const response = await fetch(`/heroi/${hero.codigo_heroi}`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedHero),
      });

      if (response.ok) {
          alert(`Herói ${editedHero.nome_heroi} atualizado com sucesso.`);
          setIsEditing(false);
          window.location.reload();
      } else {
          alert("Erro ao atualizar o herói.");
      }
  } catch (error) {
      console.error("Erro na requisição PUT:", error);
      alert("Erro ao tentar atualizar o herói.");
  }
};

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="infoHero">
      <h1 className="titleHero">{isEditing ? "Editar Herói" : hero.nome_heroi}</h1>
      {isEditing ? (
        <form className="editForms">
          <label>Nome Real:</label>
          <input
            type="text"
            name="nome_real"
            value={editedHero.nome_real}
            onChange={handleInputChange}
          />
          <br />

          <label>Nome Herói:</label>
          <input
            type="text"
            name="nome_heroi"
            value={editedHero.nome_heroi}
            onChange={handleInputChange}
          />
          <br />

          <label>Sexo:</label>
          <input
            type="text"
            name="sexo"
            value={editedHero.sexo}
            onChange={handleInputChange}
          />
          <br />

          <label>Altura (cm):</label>
          <input
            type="number"
            name="altura_heroi"
            value={editedHero.altura_heroi}
            onChange={handleInputChange}
          />
          <br />

          <label>Peso (kg):</label>
          <input
            type="number"
            name="peso_heroi"
            value={editedHero.peso_heroi}
            onChange={handleInputChange}
          />
          <br />

          <label>Local de Nascimento:</label>
          <input
            type="text"
            name="local_nascimento"
            value={editedHero.local_nascimento}
            onChange={handleInputChange}
          />
          <br />

          <label>Poderes:</label>
          <input
            type="text"
            name="poderes"
            value={editedHero.poderes}
            onChange={handleInputChange}
          />
          <br />

          <label>Nível de Força:</label>
          <input
            type="number"
            name="nivel_forca"
            value={editedHero.nivel_forca}
            onChange={handleInputChange}
          />
          <br />

          <label>Popularidade:</label>
          <input
            type="number"
            name="popularidade"
            value={editedHero.popularidade}
            onChange={handleInputChange}
          />
          <br />

          <label>Status:</label>
          <input
            type="text"
            name="status"
            value={editedHero.status}
            onChange={handleInputChange}
          />
          <br />

          <label>Histórico de Batalhas:</label>
          <textarea
            name="historico_batalhas"
            value={editedHero.historico_batalhas}
            onChange={handleInputChange}
          />
          <br />

          <label>Data de Nascimento:</label>
          <input
            type="date"
            name="data_nascimento"
            value={editedHero.data_nascimento}
            onChange={handleInputChange}
          />
          <br />

          <div className="butoesEdit">
            <button type="button" onClick={handleEdit}>
              Salvar
            </button>
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <>
          <p><strong>Nome Real:</strong> {hero.nome_real}</p>
          <p><strong>Sexo:</strong> {hero.sexo}</p>
          <p><strong>Altura:</strong> {hero.altura_heroi} m</p>
          <p><strong>Peso:</strong> {hero.peso_heroi} kg</p>
          <p><strong>Local de Nascimento:</strong> {hero.local_nascimento}</p>
          <p><strong>Poderes:</strong> {hero.poderes}</p>
          <p><strong>Nível de Força:</strong> {hero.nivel_forca}</p>
          <p><strong>Popularidade:</strong> {hero.popularidade}</p>
          <p><strong>Status:</strong> {hero.status}</p>
          <p>
            <strong>Histórico de Batalhas:</strong> {`${hero.historico_batalhas[0]} vitórias e ${hero.historico_batalhas[1]} derrotas`}
          </p>
          <p><strong>Data de Nascimento:</strong> {formatDate(hero.data_nascimento)}</p>
          <button className="deleteButton" onClick={handleDelete}>Deletar Herói</button>
          <button className="editButton" onClick={() => setIsEditing(true)}>Editar Herói</button>
        </>
      )}
    </div>
  );
}

export default HeroDetails;
