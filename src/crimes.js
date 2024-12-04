import React, { useEffect, useState } from "react";
import './crimes.css';

function Crimes() {
    const [crimes, setCrimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [heroiNomes, setHeroiNomes] = useState({});
    const [herois, setHerois] = useState([]);
    const [novoCrime, setNovoCrime] = useState({
        nome: "",
        descricao: "",
        data: "",
        heroi_responsavel: "",
        severidade: 0, // Alterado para um número inicial
    });
    const [filtroSeveridade, setFiltroSeveridade] = useState("");
    const [filtroHeroi, setFiltroHeroi] = useState("");

    const fetchHeroiNome = async (id) => {
        try {
            const response = await fetch(`/heroi?id=${id}`);
            if (!response.ok) {
                throw new Error(`Erro ao buscar herói com ID ${id}`);
            }

            const data = await response.json();
            const heroi = data.find((item) => item.codigo_heroi === id);

            return heroi ? heroi.nome_heroi || "Desconhecido" : "Desconhecido";
        } catch (err) {
            console.error(err.message);
            return "Desconhecido";
        }
    };

    const fetchHerois = async () => {
        try {
            const response = await fetch("/heroi");
            if (!response.ok) {
                throw new Error(`Erro ao buscar heróis: ${response.status}`);
            }
            const data = await response.json();
            setHerois(data);
        } catch (err) {
            console.error(err.message);
            setError("Erro ao carregar heróis: " + err.message);
        }
    };

    useEffect(() => {
        fetchHerois();
        fetchCrimes();
    }, []);

    const fetchCrimes = async () => {
        try {
            const response = await fetch("/crimes");
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            const data = await response.json();

            const crimesComSeveridadeNumerica = data.map((crime) => ({
                ...crime,
                severidade: Number(crime.severidade),
            }));

            const heroiPromises = crimesComSeveridadeNumerica.map(async (crime) => {
                const nome = await fetchHeroiNome(crime.heroi_responsavel);
                return { id: crime.heroi_responsavel, nome };
            });

            const herois = await Promise.all(heroiPromises);

            const novoMapaHerois = herois.reduce((map, heroi) => {
                if (heroi.id) {
                    map[heroi.id] = heroi.nome;
                }
                return map;
            }, {});

            setHeroiNomes(novoMapaHerois);
            setCrimes(crimesComSeveridadeNumerica);
        } catch (err) {
            setError("Erro ao carregar crimes: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const inserirCrime = async () => {
        try {
            const response = await fetch("/crimes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(novoCrime),
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            alert("Crime inserido com sucesso!");
            setIsDrawerOpen(false);
            setNovoCrime({ nome: "", descricao: "", data: "", heroi_responsavel: "", severidade: 0 });
            fetchCrimes();
        } catch (err) {
            alert("Erro ao inserir crime: " + err.message);
        }
    };

    const ocultarCrime = async (id) => {
        try {
            const response = await fetch(`/crimes/${id}`, {
                method: "PATCH",
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            alert("Crime ocultado com sucesso!");
            fetchCrimes();
        } catch (err) {
            alert("Erro ao ocultar crime: " + err.message);
        }
    };

    const crimesFiltrados = crimes.filter((crime) => {
        const nomeHeroi = heroiNomes[crime.heroi_responsavel]?.toLowerCase() || "";
        return (
            (!filtroSeveridade || crime.severidade === Number(filtroSeveridade)) &&
            (!filtroHeroi || nomeHeroi.includes(filtroHeroi.toLowerCase()))
        );
    });

    return (
        <div className="Crimes">
            <h1>Crimes</h1>
            <p className="textoInicial">
                Aqui você pode fazer a consulta, adição, remoção e modificação de um crime no banco de dados
            </p>
            <div className="filtros">
                <label>
                    Filtro por Severidade:
                    <input
                        type="number"
                        value={filtroSeveridade}
                        onChange={(e) => setFiltroSeveridade(e.target.value)}
                    />
                </label>
                <label>
                    Filtro por Herói:
                    <input
                        type="text"
                        value={filtroHeroi}
                        onChange={(e) => setFiltroHeroi(e.target.value)}
                    />
                </label>
            </div>
            <button className="inserirCrime" onClick={() => setIsDrawerOpen(true)}>
                Inserir Crime
            </button>
            {isDrawerOpen && (
                <div className={`drawer ${isDrawerOpen ? "open" : ""}`}>
                    <div className="drawer-content">
                        <h2>Inserir Novo Crime</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                inserirCrime();
                            }}
                        >
                            <label>
                                Nome do Crime:
                                <input
                                    type="text"
                                    value={novoCrime.nome}
                                    onChange={(e) => setNovoCrime({ ...novoCrime, nome: e.target.value })}
                                    required
                                />
                            </label>
                            <label>
                                Descrição:
                                <textarea
                                    value={novoCrime.descricao}
                                    onChange={(e) => setNovoCrime({ ...novoCrime, descricao: e.target.value })}
                                    required
                                />
                            </label>
                            <label>
                                Data do Crime:
                                <input
                                    type="date"
                                    value={novoCrime.data}
                                    onChange={(e) => setNovoCrime({ ...novoCrime, data: e.target.value })}
                                    required
                                />
                            </label>
                            <label>
                                Herói Responsável:
                                <select
                                    value={novoCrime.heroi_responsavel}
                                    onChange={(e) =>
                                        setNovoCrime({ ...novoCrime, heroi_responsavel: e.target.value })
                                    }
                                    required
                                >
                                    <option value="" disabled>Selecione um herói</option>
                                    {herois.map((heroi) => (
                                        <option key={heroi.codigo_heroi} value={heroi.codigo_heroi}>
                                            {heroi.nome_heroi}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Severidade:
                                <input
                                    type="number"
                                    value={novoCrime.severidade}
                                    onChange={(e) => setNovoCrime({ ...novoCrime, severidade: Number(e.target.value) })}
                                    required
                                    min="0"
                                />
                            </label>
                            <div className="drawer-buttons">
                                <button type="submit">Salvar</button>
                                <button type="button" onClick={() => setIsDrawerOpen(false)}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {loading && <p>Carregando crimes...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="crime-container">
                {!loading && !error && (
                    crimesFiltrados.length > 0 ? (
                        crimesFiltrados.map((crime) => (
                            <div key={crime.id} className="crime-card">
                                <h2>{crime.nome}</h2>
                                <p><strong>Descrição:</strong> {crime.descricao}</p>
                                <p><strong>Data:</strong> {new Date(crime.data).toLocaleDateString()}</p>
                                <p><strong>Herói responsável:</strong> {heroiNomes[crime.heroi_responsavel] || "Nenhum"}</p>
                                <p><strong>Severidade:</strong> {crime.severidade}</p>
                                <button className="ocultarBotao" onClick={() => ocultarCrime(crime.id)}>Ocultar</button>
                            </div>
                        ))
                    ) : (
                        <p>Nenhum crime encontrado.</p>
                    )
                )}
            </div>
        </div>
    );
}

export default Crimes;
