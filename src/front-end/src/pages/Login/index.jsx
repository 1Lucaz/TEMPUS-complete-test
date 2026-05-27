import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import api from '../../services/api';
import './styles.css';

export default function Login() {
  const [clientEmail, setClientEmail] = useState('');
  const [clientPassword, setClientPassword] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [employeePassword, setEmployeePassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [panelActive, setPanelActive] = useState('client');
  const navigate = useNavigate();

  const handleLogin = async (e, tipoPainel) => {
    e.preventDefault();
    setLoading(true);

    const isColaborador = tipoPainel === 'employee';

    const email = isColaborador ? employeeEmail : clientEmail;
    const senha = isColaborador ? employeePassword : clientPassword;

    try {
      const formData = new URLSearchParams();
      formData.append('username', email.trim());
      formData.append('password', senha.trim());

      const response = await api.post(
        `/login?is_colaborador=${isColaborador}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const token = response.data?.access_token;

      if (!token) {
        alert('Erro: token não retornado pelo servidor');
        return;
      }

      localStorage.clear();
      localStorage.setItem('token', token);

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      navigate('/dashboard');
    } catch (error) {
      const mensagem =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Erro ao logar';

      alert(mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="login-split-page">
        <main className="login-split-container">

          <div
            className={`panel client ${panelActive === 'client' ? 'active' : ''}`}
            onClick={() => setPanelActive('client')}
          >
            <div className="panel-info">
              <div className="icon">👤</div>
              <h2>Cliente</h2>
              <span>Acesso rápido</span>
            </div>

            <div className="form-area" onClick={(e) => e.stopPropagation()}>
              <h1>Login Cliente</h1>

              <form onSubmit={(e) => handleLogin(e, 'client')}>
                <InputField
                  label="E-mail"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  required
                />

                <InputField
                  label="Senha"
                  type="password"
                  value={clientPassword}
                  onChange={(e) => setClientPassword(e.target.value)}
                  required
                />

                <button type="submit" disabled={loading} className="btn-submit client-btn">
                  {loading && panelActive === 'client' ? 'Entrando...' : 'Entrar'}
                </button>
              </form>
            </div>
          </div>

          <div
            className={`panel employee ${panelActive === 'employee' ? 'active' : ''}`}
            onClick={() => setPanelActive('employee')}
          >
            <div className="panel-info">
              <div className="icon">💼</div>
              <h2>Funcionário</h2>
              <span>Painel interno</span>
            </div>

            <div className="form-area" onClick={(e) => e.stopPropagation()}>
              <h1>Acesso Administrativo</h1>

              <form onSubmit={(e) => handleLogin(e, 'employee')}>
                <InputField
                  label="E-mail"
                  type="email"
                  value={employeeEmail}
                  onChange={(e) => setEmployeeEmail(e.target.value)}
                  required
                />

                <InputField
                  label="Senha"
                  type="password"
                  value={employeePassword}
                  onChange={(e) => setEmployeePassword(e.target.value)}
                  required
                />

                <button type="submit" disabled={loading} className="btn-submit employee-btn">
                  {loading && panelActive === 'employee' ? 'Entrando...' : 'Entrar'}
                </button>
              </form>
            </div>
          </div>

        </main>
      </div>
    </>
  );
}