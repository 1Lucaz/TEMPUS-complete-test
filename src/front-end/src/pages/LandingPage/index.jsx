import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import './styles.css';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate('/Login');
  };

  return (
    <div className="landing-container">
      <Header />
      
      <section className="hero-section">
        <div className="hero-text">
          <div className="hero-tag">Gestão de Fluxo e Atendimento</div>
          <h1 className="hero-title">Controle total da <span>operação</span> na palma da mão.</h1>
          <p className="hero-subtitle">
            O TEMPUS centraliza o gerenciamento de serviços para sua equipe, 
            garantindo que o cliente acompanhe cada etapa com transparência.
          </p>
          <div className="hero-actions">
            <button 
              className="btn-primary animate-hover" 
              onClick={handleGoToLogin}
            >
              Acessar Área do Cliente
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="placeholder-img">[Dashboard de Gestão]</div>
        </div>
      </section>

      <section id="gestao" className="robust-section">
        <div className="section-content">
          <div className="section-icon">📋</div>
          <div className="section-text">
            <h2>Gestão Inteligente de Ordens</h2>
            <p>
              Centralize todas as demandas em um só lugar. Nossa interface permite que gestores 
              e funcionários visualizem prioridades, prazos e responsabilidades de forma clara, 
              eliminando gargalos na comunicação interna.
            </p>
          </div>
        </div>
      </section>

      <section id="fluxo" className="robust-section alternate-bg">
        <div className="section-content reverse">
          <div className="section-icon">⏱️</div>
          <div className="section-text">
            <h2>Fluxo de Trabalho em Tempo Real</h2>
            <p>
              Monitore o progresso de cada serviço individualmente. Com o sistema de status do TEMPUS, 
              sua equipe atualiza o andamento das tarefas instantaneamente, otimizando o tempo de resposta 
              e a produtividade do time.
            </p>
          </div>
        </div>
      </section>

      <section id="cliente" className="robust-section">
        <div className="section-content">
          <div className="section-icon">📱</div>
          <div className="section-text">
            <h2>Transparência para o Cliente</h2>
            <p>
              Reduza o volume de mensagens de suporte. O cliente recebe um acesso exclusivo para 
              acompanhar a evolução do seu pedido ou serviço em tempo real, gerando muito mais 
              confiança e satisfação no atendimento final.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}