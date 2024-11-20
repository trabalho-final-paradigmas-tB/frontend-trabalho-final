import React, { useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import './missoes.css';

function Missoes() {
    const [missoes, setMissoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMissao, setSelectedMissao] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [secondaryDrawerOpen, setSecondaryDrawerOpen] = useState(false);
    const [newMission, setNewMission] = useState({
        nome: '',
        descricao: '',
        classificacao: '',
        dificuldade: '',
        herois: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMission({ ...newMission, [name]: value });
    };

    useEffect(() => {
        const fetchMissoes = async () => {
            try {
                const response = await fetch('http://localhost:8091/missao');
                if (!response.ok) {
                    throw new Error('Erro ao buscar missões');
                }
                const data = await response.json();
                setMissoes(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMissoes();
    }, []);

    const handleEditClick = (missao) => {
        setSelectedMissao(missao);
        setDrawerOpen(true);
    };

    const handleAddMission = async (event) => {
        event.preventDefault();
    
        // Preparar os dados para envio
        const missionData = {
            nome: newMission.nome,
            descrição: newMission.descricao,
            classificação: newMission.classificacao,
            dificuldade: parseInt(newMission.dificuldade, 10),
            herois: newMission.herois.split(',').map((h) => h.trim()), // Dividir heróis por vírgulas
        };
    
        try {
            const response = await fetch('http://localhost:8091/missao', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(missionData),
            });
    
            if (!response.ok) {
                throw new Error('Erro ao adicionar missão');
            }
    
            const result = await response.json();
            alert(result.mensagem);
    
            setMissoes((prevMissoes) => [...prevMissoes, result.missao]);
            setSecondaryDrawerOpen(false);
            setNewMission({ nome: '', descricao: '', classificacao: '', dificuldade: '', herois: '' }); // Resetar o formulário
        } catch (err) {
            alert('Erro ao adicionar missão: ' + err.message);
        }
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        const { id, nome, descricao, classificacao, dificuldade } = selectedMissao;

        try {
            const response = await fetch(`http://localhost:8091/missao/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome,
                    descrição: descricao,
                    classificação: classificacao,
                    dificuldade: parseInt(dificuldade, 10),
                }),
            });

            if (!response.ok) {
                throw new Error('Erro ao editar missão');
            }

            const result = await response.json();
            alert(result.mensagem);

            setMissoes((prevMissoes) =>
                prevMissoes.map((missao) =>
                    missao.id === id
                        ? { ...missao, nome, descrição: descricao, classificação: classificacao, dificuldade }
                        : missao
                )
            );

            setDrawerOpen(false);
        } catch (err) {
            alert('Erro ao editar missão: ' + err.message);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Tem certeza que deseja deletar esta missão?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:8091/missao/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Erro ao deletar missão');
            }

            const result = await response.json();
            alert(result.mensagem);
            setMissoes((prevMissoes) => prevMissoes.filter((missao) => missao.id !== id));
        } catch (err) {
            alert('Erro ao deletar missão: ' + err.message);
        }
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setSelectedMissao(null);
    };

    const closeSecondaryDrawer = () => {
        setSecondaryDrawerOpen(false);
    };

    if (loading) {
        return <p>Carregando missões...</p>;
    }

    if (error) {
        return <p>Erro: {error}</p>;
    }

    return (
        <div className="Missoes">
            <h1 className="titleMissao">Missões</h1>
            <button className="botaoInserir" onClick={() => setSecondaryDrawerOpen(true)}>Inserir missão</button>
            <p className="textoMissao">Aqui é possível consultar, editar, deletar e adicionar missões no banco de dados</p>
            <div className="listaMissoes">
                {missoes.map((missao) => (
                    <div key={missao.id} className="missaoCard">
                        <h2 className="missaoTitulo">{missao.nome}</h2>
                        <p><strong>Descrição:</strong> {missao.descrição}</p>
                        <p><strong>Classificação:</strong> {missao.classificação}</p>
                        <p><strong>Dificuldade:</strong> {missao.dificuldade}</p>
                        <p><strong>Heróis:</strong> {missao.herois?.length > 0 ? missao.herois.join(', ') : 'Nenhum'}</p>
                        <div className="botoesCard">
                            <button onClick={() => handleEditClick(missao)}>Editar</button>
                            <button onClick={() => handleDelete(missao.id)}>Deletar</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Drawer de edição */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={closeDrawer}
            >
                <div style={{ width: '300px', padding: '16px' }}>
                    <h2>Editar Missão</h2>
                    {selectedMissao && (
                        <form onSubmit={handleEditSubmit}>
                            <TextField
                                label="Nome"
                                fullWidth
                                margin="normal"
                                value={selectedMissao.nome || ''}
                                onChange={(e) =>
                                    setSelectedMissao({ ...selectedMissao, nome: e.target.value })
                                }
                            />
                            <TextField
                                label="Descrição"
                                fullWidth
                                margin="normal"
                                multiline
                                rows={3}
                                value={selectedMissao.descricao || ''}
                                onChange={(e) =>
                                    setSelectedMissao({ ...selectedMissao, descricao: e.target.value })
                                }
                            />
                            <TextField
                                label="Classificação"
                                fullWidth
                                margin="normal"
                                value={selectedMissao.classificacao || ''}
                                onChange={(e) =>
                                    setSelectedMissao({ ...selectedMissao, classificacao: e.target.value })
                                }
                            />
                            <TextField
                                label="Dificuldade"
                                fullWidth
                                margin="normal"
                                type="number"
                                inputProps={{ min: 1, max: 10 }}
                                value={selectedMissao.dificuldade || ''}
                                onChange={(e) =>
                                    setSelectedMissao({ ...selectedMissao, dificuldade: e.target.value })
                                }
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                style={{ marginTop: '16px' }}
                            >
                                Salvar
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                onClick={closeDrawer}
                                style={{ marginTop: '8px' }}
                            >
                                Cancelar
                            </Button>
                        </form>
                    )}
                </div>
            </Drawer>

            {/* Novo Drawer para inserir missão */}
            <Drawer
                anchor="right"
                open={secondaryDrawerOpen}
                onClose={closeSecondaryDrawer}
            >
                <div style={{ width: '300px', padding: '16px' }}>
                    <h2>Inserir Nova Missão</h2>
                    <form onSubmit={handleAddMission}>
                        <TextField
                            name="nome"
                            label="Nome"
                            fullWidth
                            margin="normal"
                            required
                            value={newMission.nome}
                            onChange={handleInputChange}
                        />
                        <TextField
                            name="descricao"
                            label="Descrição"
                            fullWidth
                            margin="normal"
                            multiline
                            rows={3}
                            required
                            value={newMission.descricao}
                            onChange={handleInputChange}
                        />
                        <TextField
                            name="classificacao"
                            label="Classificação"
                            fullWidth
                            margin="normal"
                            required
                            value={newMission.classificacao}
                            onChange={handleInputChange}
                        />
                        <TextField
                            name="dificuldade"
                            label="Dificuldade"
                            type="number"
                            fullWidth
                            margin="normal"
                            inputProps={{ min: 1, max: 10 }}
                            required
                            value={newMission.dificuldade}
                            onChange={handleInputChange}
                        />
                        <TextField
                            name="herois"
                            label="Heróis (separados por vírgulas)"
                            fullWidth
                            margin="normal"
                            value={newMission.herois}
                            onChange={handleInputChange}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            style={{ marginTop: '16px' }}
                        >
                            Adicionar Missão
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            onClick={closeSecondaryDrawer}
                            style={{ marginTop: '8px' }}
                        >
                            Fechar
                        </Button>
                    </form>
                </div>
            </Drawer>
        </div>
    );
}

export default Missoes;
