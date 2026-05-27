import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import ItensServico from '../ItensServico';
import './styles.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/');
      return;
    }

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decoded = JSON.parse(jsonPayload);
      setUserData(decoded);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao decodificar acesso:", error);
      localStorage.clear();
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const Unauthorized = () => (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h2 style={{ color: '#ef4444' }}>Usuário não possui autorização para acessar esta funcionalidade</h2>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'USUARIOS': 
        return userData?.access_funcionario ? <h2>Gerenciamento de Usuários</h2> : <Unauthorized />;
      case 'PERFIL': 
        return <h2>Meu Perfil</h2>;
      case 'PRODUTOS': 
        return userData?.access_produto ? <h2>Catálogo de Produtos</h2> : <Unauthorized />;
      case 'ITENS_SERVICO': 
        return userData?.access_item_servico ? <ItensServico /> : <Unauthorized />;
      case 'SERVICOS': 
        return userData?.access_servico ? <h2>Gestão de Serviços</h2> : <Unauthorized />;
      default: 
        return <h2>Bem-vindo ao Painel TEMPUS</h2>;
    }
  };

  if (loading) return null;

  return (
    <div className="dashboard-page">
      <Header isLoggedIn={true} onLogout={handleLogout} />
      
      <div className="dashboard-main">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <button 
              className={`sidebar-item ${activeTab === 'DASHBOARD' ? 'active' : ''}`}
              onClick={() => setActiveTab('DASHBOARD')}
            >
              📊 DASHBOARD
            </button>

            {userData?.access_funcionario && (
              <button 
                className={`sidebar-item ${activeTab === 'USUARIOS' ? 'active' : ''}`} 
                onClick={() => setActiveTab('USUARIOS')}
              >
                👥 USUÁRIOS
              </button>
            )}

            <button 
              className={`sidebar-item ${activeTab === 'PERFIL' ? 'active' : ''}`} 
              onClick={() => setActiveTab('PERFIL')}
            >
              👤 PERFIL
            </button>

            {userData?.access_item_servico && (
              <button 
                className={`sidebar-item ${activeTab === 'ITENS_SERVICO' ? 'active' : ''}`} 
                onClick={() => setActiveTab('ITENS_SERVICO')}
              >
                🛠️ ITENS DE SERVIÇO
              </button>
            )}

            {userData?.access_servico && (
              <button 
                className={`sidebar-item ${activeTab === 'SERVICOS' ? 'active' : ''}`} 
                onClick={() => setActiveTab('SERVICOS')}
              >
                🔧 SERVIÇOS
              </button>
            )}
          </nav>
        </aside>

        <main className="dashboard-content">
          <div className="content-area">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}