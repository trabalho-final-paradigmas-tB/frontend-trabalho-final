import React, { useEffect, useState } from "react";
import './crimes.css';

function Crimes() {
    const [crimes, setCrimes] = useState([]); // Estado para armazenar os crimes
    const [loading, setLoading] = useState(true); // Estado para exibir carregamento
    const [error, setError] = useState(null); // Estado para capturar erros
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Estado para o drawer
    const [novoCrime, setNovoCrime] = useState({
        nome_crime: "",
        descricao: "",
        data_crime: "",
        heroi_responsavel: "",
        severidade: "",
    });

    // Função para buscar os crimes do back-end
    const fetchCrimes = async () => {
        try {
            const response = await fetch("/crimes"); // Faz a requisição ao back-end
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`); // Trata erros HTTP
            }
            const data = await response.json(); // Converte a resposta para JSON
            setCrimes(data); // Atualiza o estado com os crimes recebidos
        } catch (err) {
            setError("Erro ao carregar crimes: " + err.message);
        } finally {
            setLoading(false); // Desativa o carregamento
        }
    };

    // Chama fetchCrimes na montagem do componente
    useEffect(() => {
        fetchCrimes();
    }, []);

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

            await response.json(); // Resposta do back-end

            alert("Crime inserido com sucesso!");
            setIsDrawerOpen(false); // Fecha o drawer
            setNovoCrime({ nome_crime: "", descricao: "", data_crime: "", heroi_responsavel: "", severidade: "" }); // Reseta o formulário

            // Atualiza os dados dos crimes
            fetchCrimes(); // Chama a função para buscar os crimes novamente
        } catch (err) {
            alert("Erro ao inserir crime: " + err.message);
        }
    };

    // Função para ocultar um crime
    const ocultarCrime = async (id) => {
        try {
            const response = await fetch(`/crimes/${id}`, {
                method: "PATCH",
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            alert("Crime ocultado com sucesso!");
            fetchCrimes(); // Atualiza a lista de crimes
        } catch (err) {
            alert("Erro ao ocultar crime: " + err.message);
        }
    };

    return (
        <div className="Crimes">
            <h1>Crimes</h1>
            <p className="textoInicial">
                Aqui você pode fazer a consulta, adição, remoção e modificação de um crime no banco de dados
            </p>
            <button className="inserirCrime" onClick={() => setIsDrawerOpen(true)}>
                Inserir Crime
            </button>

            {/* Drawer para inserir crime */}
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
                                    value={novoCrime.nome_crime}
                                    onChange={(e) => setNovoCrime({ ...novoCrime, nome_crime: e.target.value })}
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
                                    value={novoCrime.data_crime}
                                    onChange={(e) => setNovoCrime({ ...novoCrime, data_crime: e.target.value })}
                                    required
                                />
                            </label>
                            <label>
                                Id do Herói Responsável:
                                <input
                                    type="text"
                                    value={novoCrime.heroi_responsavel}
                                    onChange={(e) =>
                                        setNovoCrime({
                                            ...novoCrime,
                                            heroi_responsavel: e.target.value || "", // Mantém o valor como string
                                        })
                                    }
                                />
                            </label>
                            <label>
                                Severidade:
                                <input
                                    type="number"
                                    value={novoCrime.severidade}
                                    onChange={(e) => setNovoCrime({ ...novoCrime, severidade: e.target.value })}
                                    required
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

            {/* Exibição de mensagens de erro ou carregamento */}
            {loading && <p>Carregando crimes...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Verificação de se crimes é null ou undefined */}
            <div className="crime-container">
                {!loading && !error && (
                    crimes && crimes.length > 0 ? (
                        crimes.map((crime) => (
                            <div key={crime.id} className="crime-card">
                                <h2>{crime.nome_crime}</h2>
                                <p><strong>Descrição:</strong> {crime.descricao}</p>
                                <p><strong>Data:</strong> {new Date(crime.data_crime).toLocaleDateString()}</p>
                                <p><strong>Id do herói responsável:</strong> {crime.heroi_responsavel || "Nenhum"}</p>
                                <p><strong>Severidade:</strong> {crime.severidade}</p>
                                <button onClick={() => ocultarCrime(crime.id)}>Ocultar</button>
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
