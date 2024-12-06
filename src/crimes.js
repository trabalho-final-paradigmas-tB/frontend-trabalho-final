import React, { useEffect, useState } from "react";
import './crimes.css';

function Crimes() {
    const [crimes, setCrimes] = useState([]);
    const [herois, setHerois] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCrime, setSelectedCrime] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // Controle do drawer de edição
    const [editedCrime, setEditedCrime] = useState(null);
    const [isInserting, setIsInserting] = useState(false); // Controle do drawer de inserção
    const [selectedHeroi, setSelectedHeroi] = useState(""); // Herói selecionado
    const [severityRange, setSeverityRange] = useState([1, 10]); // Intervalo de severidade
    const [filteredCrimes, setFilteredCrimes] = useState([]);

    const [newCrime, setNewCrime] = useState({
        nome: "",
        descricao: "",
        data: "",
        heroi_responsavel: "",
        severidade: "",
    });

    useEffect(() => {
        fetchCrimes();
        fetchHerois();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [crimes, selectedHeroi, severityRange]);

    const fetchCrimes = async () => {
        try {
            const response = await fetch("/crimes");
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            const data = await response.json();
            setCrimes(data);
        } catch (err) {
            setError("Erro ao carregar crimes: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        const filtered = crimes.filter(crime => {
            const matchesHeroi = selectedHeroi
                ? crime.heroi_responsavel === selectedHeroi
                : true; // Sem filtro de herói se vazio
    
            const matchesSeverity = 
                crime.severidade >= severityRange[0] &&
                crime.severidade <= severityRange[1]; // Dentro do intervalo
    
            return matchesHeroi && matchesSeverity;
        });
    
        setFilteredCrimes(filtered); // Atualiza a lista filtrada
    };

    const fetchHerois = async () => {
        try {
            const response = await fetch("/heroi");
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            const data = await response.json();
            setHerois(data);
        } catch (err) {
            alert("Erro ao carregar heróis: " + err.message);
        }
    };

    const handleDeletarCrime = async (id) => {
        const confirm = window.confirm("Deseja realmente deletar este crime?");
        if (!confirm) return;

        try {
            const response = await fetch(`/crimes/${id}`, { method: "DELETE" });
            if (!response.ok) {
                throw new Error(`Erro ao deletar crime: ${response.statusText}`);
            }

            alert("Crime deletado com sucesso!");
            fetchCrimes();
            setSelectedCrime(null);
        } catch (err) {
            alert("Erro ao deletar crime: " + err.message);
        }
    };

    const handleOcultarCrime = async (id) => {
        const confirm = window.confirm("Deseja realmente ocultar este crime?");
        if (!confirm) return;
    
        try {
            const response = await fetch(`/crimes/${id}`, { method: "PATCH" });
            if (!response.ok) {
                throw new Error(`Erro ao ocultar crime: ${response.statusText}`);
            }
    
            alert("Crime ocultado com sucesso!");
            fetchCrimes();
        } catch (err) {
            alert("Erro ao ocultar crime: " + err.message);
        }
    };
    

    const handleInserirCrime = async () => {
        try {
            const response = await fetch("/crimes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCrime),
            });

            if (!response.ok) {
                throw new Error(`Erro ao inserir crime: ${response.statusText}`);
            }

            alert("Crime inserido com sucesso!");
            fetchCrimes();
            setIsInserting(false);
            setNewCrime({ nome: "", descricao: "", data: "", heroi_responsavel: "", severidade: "" });
        } catch (err) {
            alert("Erro ao inserir crime: " + err.message);
        }
    };

    const openEditDrawer = (crime) => {
        setEditedCrime({ ...crime });
        setIsEditing(true);
    };

    const closeDrawer = () => {
        setSelectedCrime(null);
        setIsEditing(false);
        setIsInserting(false);
    };

    const handleSaveEdit = async () => {
        const confirm = window.confirm("Deseja realmente salvar as alterações neste crime?");
        if (!confirm) return;
    
        try {
            const response = await fetch(`/crimes/${editedCrime.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editedCrime),
            });
    
            if (!response.ok) {
                throw new Error(`Erro ao editar crime: ${response.statusText}`);
            }
    
            alert("Crime atualizado com sucesso!");
            fetchCrimes();
            closeDrawer();
        } catch (err) {
            alert("Erro ao editar crime: " + err.message);
        }
    };
    

    const getHeroiNome = (codigoHeroi) => {
        const heroi = herois.find(h => h.codigo_heroi === codigoHeroi);
        return heroi ? heroi.nome_heroi : "Desconhecido";
    };

    return (
        <div className="Crimes">
            <h1>Lista de Crimes</h1>
            <button className="inserirCrime" onClick={() => setIsInserting(true)}>
                Adicionar Crime
            </button>
            <div className="filtros2">
                <h3>Filtrar Crimes</h3>
                
                {/* Filtro por Herói */}
                <select
                    value={selectedHeroi}
                    onChange={(e) => setSelectedHeroi(e.target.value)}
                >
                    <option value="">Todos os Heróis</option>
                    {herois.map((heroi) => (
                        <option key={heroi.codigo_heroi} value={heroi.codigo_heroi}>
                            {heroi.nome_heroi}
                        </option>
                    ))}
                </select>

                {/* Filtro por Severidade */}
                <div className="severidade">
                    <label>Severidade:</label>
                    <input
                        type="number"
                        value={severityRange[0]}
                        onChange={(e) =>
                            setSeverityRange([Number(e.target.value), severityRange[1]])
                        }
                        min="1"
                    />
                    <span>até</span>
                    <input
                        type="number"
                        value={severityRange[1]}
                        onChange={(e) =>
                            setSeverityRange([severityRange[0], Number(e.target.value)])
                        }
                        max="10"
                    />
                </div>
            </div>
            <p className="textoInicial">Clique em um dos crimes abaixo ou adicione um novo.</p>
            {loading && <p>Carregando crimes...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="crime-container">
                {!loading && !error && (
                    filteredCrimes.length > 0 ? (
                        filteredCrimes.map((crime) => (
                            <div
                                key={crime.id}
                                className="crime-card"
                                onClick={() => setSelectedCrime(crime)}
                            >
                                <h2>{crime.nome}</h2>
                            </div>
                        ))
                    ) : (
                        <p>Nenhum crime encontrado.</p>
                    )
                )}
            </div>

            {selectedCrime && (
                <div className="drawer open">
                    <div className="drawer-content">
                        <button className="close-drawer" onClick={closeDrawer}>X</button>
                        <h2>{selectedCrime.nome}</h2>
                        <p><strong>Descrição:</strong> {selectedCrime.descricao}</p>
                        <p><strong>Data:</strong> {new Date(selectedCrime.data).toLocaleDateString()}</p>
                        <p><strong>Herói Responsável:</strong> {getHeroiNome(selectedCrime.heroi_responsavel)}</p>
                        <p><strong>Severidade:</strong> {selectedCrime.severidade}</p>

                        <div className="crime-actions">
                            <button onClick={() => handleDeletarCrime(selectedCrime.id)}>Deletar</button>
                            <button onClick={() => openEditDrawer(selectedCrime)}>Editar</button>
                            <button onClick={() => handleOcultarCrime(selectedCrime.id)}>Ocultar Crime</button>
                        </div>
                    </div>
                </div>
            )}

            {isInserting && (
                <div className="drawer open">
                    <div className="drawer-content">
                        <button className="close-drawer" onClick={closeDrawer}>X</button>
                        <h2>Inserir Novo Crime</h2>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="text"
                                placeholder="Nome"
                                value={newCrime.nome}
                                onChange={(e) => setNewCrime({ ...newCrime, nome: e.target.value })}
                            />
                            <textarea
                                placeholder="Descrição"
                                value={newCrime.descricao}
                                onChange={(e) => setNewCrime({ ...newCrime, descricao: e.target.value })}
                            />
                            <input
                                type="date"
                                value={newCrime.data}
                                onChange={(e) => setNewCrime({ ...newCrime, data: e.target.value })}
                            />
                            <select
                                value={newCrime.heroi_responsavel}
                                onChange={(e) => setNewCrime({ ...newCrime, heroi_responsavel: e.target.value })}
                            >
                                <option value="">Selecione um Herói</option>
                                {herois.map((heroi) => (
                                    <option key={heroi.codigo_heroi} value={heroi.codigo_heroi}>
                                        {heroi.nome_heroi}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                placeholder="Severidade"
                                value={newCrime.severidade}
                                onChange={(e) =>
                                    setNewCrime({ ...newCrime, severidade: parseInt(e.target.value, 10) || 0 })
                                }
                            />
                            <button onClick={handleInserirCrime}>Inserir Crime</button>
                        </form>
                    </div>
                </div>
            )}

            {isEditing && (
                <div className="drawer open">
                    <div className="drawer-content">
                        <button className="close-drawer" onClick={closeDrawer}>X</button>
                        <h2>Editar Crime</h2>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="text"
                                value={editedCrime.nome}
                                onChange={(e) =>
                                    setEditedCrime({ ...editedCrime, nome: e.target.value })
                                }
                            />
                            <textarea
                                value={editedCrime.descricao}
                                onChange={(e) =>
                                    setEditedCrime({ ...editedCrime, descricao: e.target.value })
                                }
                            />
                            <input
                                type="date"
                                value={editedCrime.data}
                                onChange={(e) =>
                                    setEditedCrime({ ...editedCrime, data: e.target.value })
                                }
                            />
                            <select
                                value={editedCrime.heroi_responsavel}
                                onChange={(e) =>
                                    setEditedCrime({ ...editedCrime, heroi_responsavel: e.target.value })
                                }
                            >
                                <option value="">Selecione um Herói</option>
                                {herois.map((heroi) => (
                                    <option key={heroi.codigo_heroi} value={heroi.codigo_heroi}>
                                        {heroi.nome_heroi}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                value={editedCrime.severidade}
                                onChange={(e) =>
                                    setEditedCrime({ ...editedCrime, severidade: e.target.value })
                                }
                            />
                            <button onClick={handleSaveEdit}>Salvar Alterações</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Crimes;
