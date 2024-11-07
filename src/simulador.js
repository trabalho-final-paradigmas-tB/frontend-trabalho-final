import React from "react";
import './simulador.css';

function Simulador() {
    return (
        <div className="simulador-container">
            <div className="Simulador">
                <h1>Simulador</h1>
                <div className="container">
                    <div className="left-fighter">
                        <span>Escolha o lutador 1:</span>
                        <select className="fighter-select">
                            <option>Batman</option>
                            <option>Superman</option>
                        </select>
                        <img className="infoIcon" src="/assets/botao-de-informacoes.png" alt="iconInfo" style={{ width: '40px', height: '40px' }}/> 
                    </div>
                    <div className="right-fighter">
                        <span>Escolha o lutador 2:</span>
                        <select className="fighter-select">
                            <option>SuperTutu</option>
                            <option>Wonder Woman</option>
                        </select>
                        <img className="infoIcon" src="/assets/botao-de-informacoes.png" alt="iconInfo" style={{ width: '40px', height: '40px' }}/> 
                    </div>
                </div>
                <button className="battle-button">Batalhar</button>
            </div>
        </div>
    );
}

export default Simulador;
