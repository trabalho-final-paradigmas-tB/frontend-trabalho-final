import React, { useState, useEffect } from "react";
import './simulador.css';

function Simulador() {
    const [herois, setHerois] = useState([]);
    const [selectedHeroiID, setSelectedHeroiID] = useState(null);
    const [heroiDetails, setHeroiDetails] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        async function fetchHerois() {
            try {
                const response = await fetch('/heroi');
                if (!response.ok) {
                    throw new Error("Erro ao buscar heróis");
                }
                const data = await response.json();
                setHerois(data);
            } catch (error) {
                console.error(error.message);
            }
        }
        fetchHerois();
    }, []);

    const handleInfoClick = async () => {
        if (selectedHeroiID) {
            try {
                // Usando query string com o ID do herói selecionado
                const response = await fetch(`/heroi?id=${selectedHeroiID}`);
                if (!response.ok) {
                    throw new Error("Erro ao buscar detalhes do herói");
                }
                const data = await response.json();
                setHeroiDetails(data);
                setDialogOpen(true);
            } catch (error) {
                console.error(error.message);
            }
        }
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setHeroiDetails(null);
    };

    return (
        <div className="simulador-container">
            <div className="Simulador">
                <h1>Simulador</h1>
                <div className="container">
                    <div className="left-fighter">
                        <span>Escolha o lutador 1:</span>
                        <select className="fighter-select" onChange={(e) => setSelectedHeroiID(e.target.value)}>
                            <option value="">Selecione um herói</option>
                            {herois.map((heroi) => (
                                <option key={heroi.codigo_heroi} value={heroi.codigo_heroi}>
                                    {heroi.nome_heroi}
                                </option>
                            ))}
                        </select>
                        <img className="infoIcon" src="/assets/botao-de-informacoes.png" alt="iconInfo" style={{ width: '40px', height: '40px', cursor: 'pointer' }} onClick={handleInfoClick} /> 
                    </div>
                    <div className="right-fighter">
                        <span>Escolha o lutador 2:</span>
                        <select className="fighter-select" onChange={(e) => setSelectedHeroiID(e.target.value)}>
                            <option value="">Selecione um herói</option>
                            {herois.map((heroi) => (
                                <option key={heroi.codigo_heroi} value={heroi.codigo_heroi}>
                                    {heroi.nome_heroi}
                                </option>
                            ))}
                        </select>
                        <img className="infoIcon" src="/assets/botao-de-informacoes.png" alt="iconInfo" style={{ width: '40px', height: '40px', cursor: 'pointer' }} onClick={handleInfoClick} /> 
                    </div>
                </div>
                <button className="battle-button">Batalhar</button>

                {/* Dialog para exibir detalhes do herói */}
                <dialog open={dialogOpen} className="heroi-dialog">
                    {heroiDetails ? (
                        <div>
                            <h2>{heroiDetails.nome_heroi}</h2>
                            <p><strong>Nome Real:</strong> {heroiDetails.nome_real}</p>
                            <p><strong>Sexo:</strong> {heroiDetails.sexo}</p>
                            <p><strong>Altura:</strong> {heroiDetails.altura_heroi} cm</p>
                            <p><strong>Peso:</strong> {heroiDetails.peso_heroi} kg</p>
                            <p><strong>Poderes:</strong> {heroiDetails.poderes}</p>
                            <p><strong>Nível de Força:</strong> {heroiDetails.nivel_forca}</p>
                            <p><strong>Popularidade:</strong> {heroiDetails.popularidade}</p>
                            <button onClick={handleCloseDialog}>Fechar</button>
                        </div>
                    ) : (
                        <p>Carregando...</p>
                    )}
                </dialog>
            </div>
        </div>
    );
}

export default Simulador;
