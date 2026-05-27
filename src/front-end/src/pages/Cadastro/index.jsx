import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import api from '../../services/api'; 
import './styles.css';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dadosCliente = {
      nome: nome,
      email: email,
      telefone: telefone,
      senha: senha,
      ativo: true 
    };

    try {
      const response = await api.post('/api/clientes/registrar-conta', dadosCliente);
      
      if (response.status === 201 || response.status === 200) {
        alert('Conta criada com sucesso!');
        navigate('/login');
      }
    } catch (error) {
      const msg = error.response?.data?.detail || 'Erro ao criar conta.';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="cadastro-page">
        <main className="cadastro-form-container">
          <div className="form-wrapper">
            <div className="form-header">
              <h1 className="form-title">Cadastro de Cliente</h1>
              <p className="form-subtitle">Preencha os dados para criar um novo acesso.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-body">
                <InputField 
                  label="Nome Completo"
                  placeholder="Joao Silva"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
                <InputField 
                  label="E-mail"
                  placeholder="exemplo@gmail.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <InputField 
                  label="Telefone"
                  placeholder="(00) 00000-0000"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  required
                />
                <InputField 
                  label="Senha"
                  placeholder="Digite sua senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn-form-submit animate-hover"
                disabled={loading}
              >
                {loading ? 'Cadastrando...' : 'Criar Conta'}
              </button>
            </form>
          </div>
        </main>

        <aside className="cadastro-aside">
          <h2 className="aside-title">Conectando sua empresa ao futuro.</h2>
          <p style={{color: 'var(--text-dark)', marginTop: '20px'}}>
            Cadastre-se com facilidade!
            Realize o cadastro no Tempus System e tenha tudo organizado em um só lugar.
          </p>
          <p style={{marginTop:'15px'}}>👉 Mais organização</p>
          <p>👉 Mais agilidade</p>
          <p>👉 Mais produtividade</p>
        </aside>
      </div>
    </>
  );
}