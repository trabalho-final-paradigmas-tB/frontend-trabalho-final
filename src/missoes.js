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
            value={mission.descrição}
            onChange={onChange}
        />
        <TextField
            name="classificacao"
            label="Classificação"
            fullWidth
            margin="normal"
            required
            value={mission.classificação}
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
        <TextField
            select
            name="recompensa_tipo"
            label="Recompensa Tipo"
            fullWidth
            margin="normal"
            value={mission.recompensa_tipo}
            onChange={onChange}
            SelectProps={{
                native: true,
            }}
            required
        >
            <option value="" disabled>
                Selecione...
            </option>
            <option value="Força">Força</option>
            <option value="Popularidade">Popularidade</option>
        </TextField>

        <TextField
            name="recompensa_valor"
            label="Recompensa Valor"
            type="number"
            fullWidth
            margin="normal"
            inputProps={{ min: 0 }}
            required
            value={mission.recompensa_valor}
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
    const [resultadoDrawerOpen, setResultadoDrawerOpen] = useState(false);
    const [resultadoMissao, setResultadoMissao] = useState(null);
    const [selectedMissao, setSelectedMissao] = useState(null);

    const [newMission, setNewMission] = useState({
        nome: '',
        descricao: '',
        classificacao: '',
        dificuldade: '',
        herois: '',
        recompensa_tipo: '',
        recompensa_valor: '',
    });

    // Fetch de missões
    useEffect(() => {
        const fetchMissoes = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error('Erro ao buscar missões');
                const data = await response.json();
                console.log('Missões retornadas:', data);
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

    console.log('Recompensa Tipo:', newMission.recompensa_tipo);
console.log('Recompensa Valor:', newMission.recompensa_valor);


    const handleAddMission = async (event) => {
        event.preventDefault();
        const missionData = {
            ...newMission,
            dificuldade: parseInt(newMission.dificuldade, 10),
            recompensa_valor: parseInt(newMission.recompensa_valor), // Certifique-se de que este campo tem um valor válido
            herois: newMission.herois.split(',').map((h) => h.trim()),
        };
        
        console.log('Dados da missão enviados:', missionData);

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
                recompensa_tipo: '',
                recompensa_valor: '',
            });
            window.location.reload();
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
        const missao = missoes.find((m) => m.id === id);
        if (!missao) {
            alert('Missão não encontrada');
            return;
        }
    
        try {
            const response = await fetch(`${API_URL}/resultadomissao`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(missao),
            });
    
            if (!response.ok) throw new Error('Erro ao verificar resultado da missão');
            const resultado = await response.json();
    
            // Filtrar duplicatas se existirem
            const resultadosUnicos = resultado.resultados.filter(
                (item, index, self) =>
                    index === self.findIndex((t) => t.heroi === item.heroi && t.mensagem === item.mensagem)
            );
    
            setResultadoMissao({ ...resultado, resultados: resultadosUnicos });
            setResultadoDrawerOpen(true);
        } catch (err) {
            alert('Erro ao verificar resultado: ' + err.message);
        }
    };
    
    const handleEditSubmit = async (event) => {
        event.preventDefault();
        if (!selectedMissao) return;
    
        const confirmEdit = window.confirm('Você tem certeza que deseja salvar as alterações desta missão?');
        if (!confirmEdit) return;
    
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

    console.log(missoes)

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
                            <p><strong>Recompensa Tipo:</strong> {missao.recompensa_tipo || 'Não especificado'}</p>
                            <p><strong>Recompensa Valor:</strong> {missao.recompensa_valor || 'Não especificado'}</p>

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

            <Drawer open={resultadoDrawerOpen} onClose={() => setResultadoDrawerOpen(false)}>
                <div style={{ padding: '20px', width: '400px' }}>
                    <h2>Resultado da Missão</h2>
                    {resultadoMissao && (
                        <div>
                            <p><strong>Missão:</strong> {resultadoMissao.missao}</p>
                            {resultadoMissao.resultados.map((resultado, index) => (
                                <div key={index} style={{ marginBottom: '16px' }}>
                                    <p><strong>Mensagem:</strong> {resultado.mensagem}</p>
                                    <p><strong>Herói:</strong> {resultado.heroi}</p>
                                    <p><strong>Nova Popularidade:</strong> {resultado.nova_popularidade}</p>
                                    <p><strong>Novo Nível de Força:</strong> {resultado.novo_nivel_forca}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    <Button onClick={() => setResultadoDrawerOpen(false)}>Fechar</Button>
                </div>
            </Drawer>

            <Drawer 
                open={drawerOpen} 
                onClose={() => setDrawerOpen(false)}
            >
                <div className="drawer-container">
                    <h2 className="drawer-header">Editar Missão</h2>
                    <MissionForm
                        mission={selectedMissao}
                        onChange={(e) => setSelectedMissao({ ...selectedMissao, [e.target.name]: e.target.value })}
                        onSubmit={handleEditSubmit}
                        onClose={() => setDrawerOpen(false)}
                    />
                </div>
            </Drawer>

            <Drawer 
                open={secondaryDrawerOpen} 
                onClose={() => setSecondaryDrawerOpen(false)}
            >
                <div className="drawer-container">
                    <h2 className="drawer-header">Inserir Missão</h2>
                    <MissionForm
                        mission={newMission}
                        onChange={handleInputChange}
                        onSubmit={handleAddMission}
                        onClose={() => setSecondaryDrawerOpen(false)}
                    />
                </div>
            </Drawer>
        </div>
    );
}

export default Missoes;
