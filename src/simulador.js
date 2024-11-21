import React, { useState, useEffect } from "react";
import { Drawer } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './simulador.css';

function Simulador() {
    const [herois, setHerois] = useState([]);
    const [selectedHeroiID1, setSelectedHeroiID1] = useState(null);
    const [selectedHeroiID2, setSelectedHeroiID2] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [heroiDetails, setHeroiDetails] = useState(null);

    const navigate = useNavigate();

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

    const handleInfoClick = async (id) => {
        if (!id) return; // Evita abrir o drawer sem herói selecionado.
        try {
            const response = await fetch('/heroi'); // Requisição ao endpoint que retorna todos os heróis
            if (!response.ok) {
                throw new Error("Erro ao buscar detalhes dos heróis");
            }
            const data = await response.json();
    
            // Filtrar o herói correspondente pelo ID
            const heroiSelecionado = data.find((heroi) => heroi.codigo_heroi === id);
            if (!heroiSelecionado) {
                throw new Error("Herói não encontrado");
            }
    
            setHeroiDetails(heroiSelecionado);
            setDrawerOpen(true);
        } catch (error) {
            console.error(error.message);
        }
    };

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
                let jsonString = JSON.stringify(data);
                let parsedObj = JSON.parse(jsonString);
                navigate('/resultado', { state: { batalharesultado: parsedObj } });
            } catch (error) {
                console.error(error.message);
            }
        } else {
            console.error("Selecione dois heróis para a batalha");
        }
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setHeroiDetails(null);
    };

    console.log(heroiDetails)

    return (
        <div className="simulador-container">
            <div className="Simulador">
                <h1>Simulador</h1>
                <div className="container">
                    <div className="left-fighter">
                        <span>Escolha o lutador 1:</span>
                        <select
                            className="fighter-select"
                            onChange={(e) => setSelectedHeroiID1(e.target.value)}
                        >
                            <option value="">Selecione um herói</option>
                            {herois.map((heroi) => (
                                <option key={heroi.codigo_heroi} value={heroi.codigo_heroi}>
                                    {heroi.nome_heroi}
                                </option>
                            ))}
                        </select>
                        <img
                            className="infoIcon"
                            src="/assets/botao-de-informacoes.png"
                            alt="iconInfo"
                            style={{ width: '40px', height: '40px', cursor: 'pointer' }}
                            onClick={() => handleInfoClick(selectedHeroiID1)}
                        />
                    </div>
                    <div className="right-fighter">
                        <span>Escolha o lutador 2:</span>
                        <select
                            className="fighter-select"
                            onChange={(e) => setSelectedHeroiID2(e.target.value)}
                        >
                            <option value="">Selecione um herói</option>
                            {herois.map((heroi) => (
                                <option key={heroi.codigo_heroi} value={heroi.codigo_heroi}>
                                    {heroi.nome_heroi}
                                </option>
                            ))}
                        </select>
                        <img
                            className="infoIcon"
                            src="/assets/botao-de-informacoes.png"
                            alt="iconInfo"
                            style={{ width: '40px', height: '40px', cursor: 'pointer' }}
                            onClick={() => handleInfoClick(selectedHeroiID2)}
                        />
                    </div>
                </div>
                <button className="battle-button" onClick={handleBatalha}>
                    Batalhar
                </button>

                <Drawer
                    anchor="right"
                    open={drawerOpen}
                    onClose={handleCloseDrawer}
                    PaperProps={{
                        sx: { width: "400px", backgroundColor: "#2e2e2e", color: "#fff" },
                    }}
                >
                    <div className="drawer-container">
                        {heroiDetails ? (
                            <>
                                <h2>{heroiDetails.nome_heroi}</h2>
                                <p><strong>Nome Real:</strong> {heroiDetails.nome_real}</p>
                                <p><strong>Sexo:</strong> {heroiDetails.sexo}</p>
                                <p><strong>Altura:</strong> {heroiDetails.altura} cm</p>
                                <p><strong>Peso:</strong> {heroiDetails.peso} kg</p>
                                <p><strong>Poderes:</strong> {heroiDetails.poderes}</p>
                                <p><strong>Nível de Força:</strong> {heroiDetails.nivel_forca}</p>
                                <p><strong>Popularidade:</strong> {heroiDetails.popularidade}</p>
                                <button onClick={handleCloseDrawer}>Fechar</button>
                            </>
                        ) : (
                            <p>Carregando...</p>
                        )}
                    </div>
                </Drawer>

            </div>
        </div>
    );
}

export default Simulador;
