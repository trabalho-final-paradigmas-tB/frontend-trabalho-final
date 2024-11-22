import React, { useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import './missoes.css';

// Constantes
const API_URL = 'http://localhost:8091/missao';

// Componentes auxiliares
const MissionForm = ({ mission, onChange, onSubmit, onClose }) => (
    <form onSubmit={onSubmit}>
        <TextField
            name="nome"
            label="Nome"
            fullWidth
            margin="normal"
            required
            value={mission.nome}
            onChange={onChange}
        />
        <TextField
            name="descricao"
            label="Descrição"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            required
            value={mission.descricao}
            onChange={onChange}
        />
        <TextField
            name="classificacao"
            label="Classificação"
            fullWidth
            margin="normal"
            required
            value={mission.classificacao}
            onChange={onChange}
        />
        <TextField
            name="dificuldade"
            label="Dificuldade"
            type="number"
            fullWidth
            margin="normal"
            inputProps={{ min: 1, max: 10 }}
            required
            value={mission.dificuldade}
            onChange={onChange}
        />
        <TextField
            name="herois"
            label="Heróis (separados por vírgulas)"
            fullWidth
            margin="normal"
            value={mission.herois}
            onChange={onChange}
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
            onClick={onClose}
            style={{ marginTop: '8px' }}
        >
            Cancelar
        </Button>
    </form>
);

function Missoes() {
    const [missoes, setMissoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [secondaryDrawerOpen, setSecondaryDrawerOpen] = useState(false);

    const [selectedMissao, setSelectedMissao] = useState(null);

    const [newMission, setNewMission] = useState({
        nome: '',
        descricao: '',
        classificacao: '',
        dificuldade: '',
        herois: '',
    });

    // Fetch de missões
    useEffect(() => {
        const fetchMissoes = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error('Erro ao buscar missões');
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

    // Handlers de formulários
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMission({ ...newMission, [name]: value });
    };

    const handleEditClick = (missao) => {
        setSelectedMissao(missao);
        setDrawerOpen(true);
    };

    const handleAddMission = async (event) => {
        event.preventDefault();
        const missionData = {
            ...newMission,
            dificuldade: parseInt(newMission.dificuldade, 10),
            herois: newMission.herois.split(',').map((h) => h.trim()),
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(missionData),
            });
            if (!response.ok) throw new Error('Erro ao adicionar missão');
            const result = await response.json();
            alert(result.mensagem);
            setMissoes((prev) => [...prev, missionData]);
            setSecondaryDrawerOpen(false);
            setNewMission({
                nome: '',
                descricao: '',
                classificacao: '',
                dificuldade: '',
                herois: '',
            });
        } catch (err) {
            alert('Erro ao adicionar missão: ' + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!id) {
            alert('ID da missão inválido');
            return;
        }
    
        const confirmDelete = window.confirm('Você tem certeza que deseja deletar esta missão?');
        if (!confirmDelete) return;
    
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Erro ao deletar missão');
            const result = await response.json();
            alert(result.mensagem || 'Missão deletada com sucesso');
            setMissoes((prev) => prev.filter((missao) => missao.id !== id));
        } catch (err) {
            alert('Erro ao deletar missão: ' + err.message);
        }
    };

    const handleResultado = async (id) => {
        console.log('ID da missão selecionada:', id);
    
        if (!id) {
            alert('ID da missão inválido');
            return;
        }
    
        // Garantir que você está enviando a missão completa
        const missao = missoes.find(m => m.id === id);  // Encontrar a missão com o ID
    
        if (!missao) {
            alert('Missão não encontrada');
            return;
        }
    
        try {
            const response = await fetch(`${API_URL}/resultadomissao`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(missao),  // Enviando toda a missão, não só o id
            });
    
            if (!response.ok) throw new Error('Erro ao verificar resultado da missão');
            const resultado = await response.json();
            
            alert(`Resultado da Missão:\n${JSON.stringify(resultado, null, 2)}`);
        } catch (err) {
            alert('Erro ao verificar resultado: ' + err.message);
        }
    };
    
    const handleEditSubmit = async (event) => {
        event.preventDefault();
        if (!selectedMissao) return;
    
        const updatedMission = {
            ...selectedMissao,
            dificuldade: parseInt(selectedMissao.dificuldade, 10),
            herois: Array.isArray(selectedMissao.herois)
                ? selectedMissao.herois.map((h) => h.trim()) // Já é array
                : selectedMissao.herois.split(',').map((h) => h.trim()), // É string
        };
    
        try {
            const response = await fetch(`${API_URL}/${updatedMission.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedMission),
            });
            if (!response.ok) throw new Error('Erro ao editar missão');
            const result = await response.json();
            alert(result.mensagem);
            setMissoes((prev) =>
                prev.map((missao) => (missao.id === updatedMission.id ? updatedMission : missao))
            );
            setDrawerOpen(false);
        } catch (err) {
            alert('Erro ao editar missão: ' + err.message);
        }
    };
    

    // Component principal
    if (loading) return <p>Carregando missões...</p>;
    if (error) return <p>Erro: {error}</p>;

    return (
        <div className="Missoes">
            <h1 className="titleMissao">Missões</h1>
            <button className='butaoInserir' onClick={() => setSecondaryDrawerOpen(true)}>Inserir missão</button>

            <div className="listaMissoes">
                {loading ? (
                    <p>Carregando missões...</p>
                ) : error ? (
                    <p className="error">Erro ao carregar missões: {error}</p>
                ) : !missoes || missoes.length === 0 ? (
                    <p className="nenhumaMissao">Nenhuma missão disponível no momento.</p>
                ) : (
                    missoes.map((missao) => (
                        <div key={missao.id} className="missaoCard">
                            <h2>{missao.nome}</h2>
                            <p><strong>Descrição:</strong> {missao.descricao}</p>
                            <p><strong>Classificação:</strong> {missao.classificacao}</p>
                            <p><strong>Dificuldade:</strong> {missao.dificuldade}</p>
                            <p>
                                <strong>Heróis:</strong>{' '}
                                {missao.herois && missao.herois.length > 0 ? missao.herois.join(', ') : 'Nenhum'}
                            </p>
                            <Button onClick={() => handleEditClick(missao)}>Editar</Button>
                            <Button
                                onClick={() => handleDelete(missao.id)}
                                color="error"
                                style={{ marginLeft: '8px' }}
                            >
                                Deletar
                            </Button>
                            <Button
                                className='butaoResultado'
                                onClick={() => handleResultado(missao.id)}
                                color="primary"
                                style={{ marginLeft: '8px' }}
                            >
                                Resultado
                            </Button>
                        </div>
                    ))
                )}
            </div>

            {/* Drawers */}
            <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            <MissionForm
                mission={{
                    ...selectedMissao,
                    herois: Array.isArray(selectedMissao?.herois)
                        ? selectedMissao.herois.join(', ') // Convertendo array para string
                        : selectedMissao?.herois || '', // Garantindo que seja string
                }}
                onChange={(e) =>
                    setSelectedMissao({ ...selectedMissao, [e.target.name]: e.target.value })
                }
                onSubmit={handleEditSubmit}
                onClose={() => setDrawerOpen(false)}
            />
            </Drawer>

            <Drawer open={secondaryDrawerOpen} onClose={() => setSecondaryDrawerOpen(false)}>
                <MissionForm
                    mission={newMission}
                    onChange={handleInputChange}
                    onSubmit={handleAddMission}
                    onClose={() => setSecondaryDrawerOpen(false)}
                />
            </Drawer>
        </div>
    );
}

export default Missoes;
