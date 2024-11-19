import React, { useState, useEffect } from "react";
import './simulador.css';

function Simulador() {
    const [herois, setHerois] = useState([]);
    const [selectedHeroiID, setSelectedHeroiID] = useState(null);
    const [heroiDetails, setHeroiDetails] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedHeroiID1, setSelectedHeroiID1] = useState(null);
    const [selectedHeroiID2, setSelectedHeroiID2] = useState(null);

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

   /* const handleInfoClick = async () => {
        if (selectedHeroiID) {5
            try {
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
    */
    const handleBatalha = async () => {
        if (selectedHeroiID1 && selectedHeroiID2) {
            try {
                const response1 = await fetch(`/heroiid?id=${selectedHeroiID1}`);
                const response2 = await fetch(`/heroiid?id=${selectedHeroiID2}`);

                if (!response1.ok) {
                    throw new Error("Erro ao buscar detalhes do herói 1");
                }
                if (!response2.ok) {
                    throw new Error("Erro ao buscar detalhes do herói 2");
                }

                const heroi1 = await response1.json();
                const heroi2 = await response2.json();

                console.log(heroi1);
                console.log(heroi2);

                if (!heroi1 || !heroi2) {
                    throw new Error("Dados dos heróis não encontrados");
                }

                const response = await fetch('/batalhar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ lutadores: [heroi1, heroi2] })
                });

                if (!response.ok) {
                    throw new Error("Erro ao iniciar a batalha");
                }

                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error(error.message);
            }
        } else {
            console.error("Selecione dois heróis para a batalha");
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
                        <select className="fighter-select" onChange={(e) => setSelectedHeroiID1(e.target.value)}>
                            <option value="">Selecione um herói</option>
                            {herois.map((heroi) => (
                                <option key={heroi.codigo_heroi} value={heroi.codigo_heroi}>
                                    {heroi.nome_heroi}
                                </option>
                            ))}
                        </select>
                        <img className="infoIcon" src="/assets/botao-de-informacoes.png" alt="iconInfo" style={{ width: '40px', height: '40px', cursor: 'pointer' }} /*onClick={handleInfoClick}*/ /> 
                    </div>
                    <div className="right-fighter">
                        <span>Escolha o lutador 2:</span>
                        <select className="fighter-select" onChange={(e) => setSelectedHeroiID2(e.target.value)}>
                            <option value="">Selecione um herói</option>
                            {herois.map((heroi) => (
                                <option key={heroi.codigo_heroi} value={heroi.codigo_heroi}>
                                    {heroi.nome_heroi}
                                </option>
                            ))}
                        </select>
                        <img className="infoIcon" src="/assets/botao-de-informacoes.png" alt="iconInfo" style={{ width: '40px', height: '40px', cursor: 'pointer' }} /*onClick={handleInfoClick}*//> 
                    </div>
                </div>
                <button className="battle-button" onClick={handleBatalha}>Batalhar</button>

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
