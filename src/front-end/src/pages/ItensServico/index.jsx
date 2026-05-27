import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './styles.css';

export default function ItensServico() {
  const [view, setView] = useState('LIST');
  const [itens, setItens] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [editId, setEditId] = useState(null);
  const [busca, setBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  
  const [formData, setFormData] = useState({ 
    descricao: '', 
    categoria_id: '', 
    ativo: true 
  });

  const [showCatSection, setShowCatSection] = useState(false);
  const [novaCatDesc, setNovaCatDesc] = useState('');
  const [perms, setPerms] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(window.atob(token.split('.')[1]));
        setPerms(decoded);
      } catch (e) {
        console.error("Erro ao decodificar permissões");
      }
    }
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [resItens, resCats] = await Promise.all([
        api.get('/itens/'),
        api.get('/categoria/') 
      ]);
      setItens(resItens.data);
      setCategorias(resCats.data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    
    if (!formData.descricao.trim()) {
        alert("Descrição obrigatória");
        return;
    }

    if (!formData.categoria_id || Number(formData.categoria_id) === 0) {
        alert("Por favor, selecione uma categoria para o item.");
        return;
    }

    const categoriaSelecionada = categorias.find(c => c.id.toString() === formData.categoria_id.toString());

    if (!categoriaSelecionada) {
        alert("A categoria selecionada é inválida ou não foi encontrada.");
        return;
    }

    const payload = {
      descricao: formData.descricao,
      categoria_id: Number(formData.categoria_id),
      ativo: formData.ativo,
      categoria_servico: {
        descricao: categoriaSelecionada.descricao,
        ativo: categoriaSelecionada.ativo ?? true
      }
    };

    try {
      if (editId) {
        await api.patch(`/itens/${editId}`, payload);
        alert("Item de serviço updated com sucesso");
      } else {
        await api.post('/itens/', payload);
        alert("Item de serviço cadastrado com sucesso");
      }
      carregarDados();
      setView('LIST');
    } catch (error) {
      const msgErro = error.response?.data?.detail;
      if (typeof msgErro === 'object') {
        alert(JSON.stringify(msgErro));
      } else {
        alert(msgErro || "Erro ao salvar item");
      }
    }
  };

  const handleAddCategory = async () => {
    if (!novaCatDesc.trim()) return;
    try {
      const token = localStorage.getItem('token');

      const res = await api.post('/categoria/', { 
        descricao: novaCatDesc,
        ativo: true 
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      alert("Categoria cadastrada com sucesso");
      const novaCat = res.data;
      
      await carregarDados();
      
      setFormData(prev => ({ ...prev, categoria_id: novaCat.id.toString() }));
      setShowCatSection(false);
      setNovaCatDesc('');
    } catch (error) {
      const msgErro = error.response?.data?.detail;
      if (typeof msgErro === 'object') {
        alert(JSON.stringify(msgErro));
      } else {
        alert(msgErro || "Erro ao criar categoria");
      }
    }
  };

  const filteredItens = itens.filter(i => {
    const matchBusca = i.descricao?.toLowerCase().includes(busca.toLowerCase());
    const matchCat = filtroCategoria === 'todas' || i.categoria_id?.toString() === filtroCategoria;
    return matchBusca && matchCat;
  });

  if (perms.access_item_servico === false && perms.is_admin === false) {
    return <div className="unauthorized-msg">Usuário não possui autorização para acessar esta funcionalidade</div>;
  }

  if (view === 'LIST') {
    return (
      <div className="itens-servico-container">
        <header className="page-header">
          <h2>Itens de Serviço</h2>
          {(perms.is_admin || perms.add_item_servico || perms.access_item_servico) && (
            <button className="btn-new-item" onClick={() => { 
              setEditId(null); 
              setFormData({descricao: '', categoria_id: '', ativo: true}); 
              setView('FORM'); 
            }}>
              + Novo Item
            </button>
          )}
        </header>

        <section className="filters-section">
          <input 
            placeholder="Buscar por descrição..." 
            value={busca} 
            onChange={e => setBusca(e.target.value)} 
          />
          <select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}>
            <option value="todas">Todas as Categorias</option>
            {categorias.map(c => <option key={c.id} value={c.id.toString()}>{c.descricao}</option>)}
          </select>
        </section>

        <table className="itens-table">
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Status</th>
              <th style={{textAlign: 'center'}}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredItens.map(item => (
              <tr key={item.id}>
                <td>{item.descricao}</td>
                <td>{categorias.find(c => c.id === item.categoria_id)?.descricao || "Carregando..."}</td>
                <td>
                  <span className={`status-tag ${item.ativo ? 'active' : 'inactive'}`}>
                    {item.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td style={{textAlign: 'center'}}>
                  {(perms.is_admin || perms.edit_item_servico) && (
                    <button className="btn-action-edit" onClick={() => { 
                        setEditId(item.id); 
                        setFormData({
                          descricao: item.descricao,
                          categoria_id: item.categoria_id.toString(),
                          ativo: item.ativo
                        }); 
                        setView('FORM'); 
                      }}>Editar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="itens-form-container">
      <h3>{editId ? 'Editar Item' : 'Novo Item'}</h3>

      <form onSubmit={handleSaveItem} className="itens-form">
        <div className="field-group">
          <label>Descrição *</label>
          <input 
            type="text"
            value={formData.descricao} 
            onChange={e => setFormData({...formData, descricao: e.target.value})} 
            required 
          />
        </div>

        <div className="field-group">
          <label>Categoria *</label>
          <div className="category-select-wrapper">
            <select 
              value={formData.categoria_id} 
              onChange={e => setFormData({...formData, categoria_id: e.target.value})} 
              required
            >
              <option value="">Selecione...</option>
              {categorias.map(c => <option key={c.id} value={c.id.toString()}>{c.descricao}</option>)}
            </select>
            {!showCatSection && (
              <button type="button" className="btn-trigger-cat" onClick={() => setShowCatSection(true)}>
                + Nova Categoria
              </button>
            )}
          </div>
        </div>

        <div className="field-group">
          <label>Status</label>
          <div className="status-options">
            <label>
              <input type="radio" checked={formData.ativo === true} onChange={() => setFormData({...formData, ativo: true})} /> Ativo
            </label>
            <label>
              <input type="radio" checked={formData.ativo === false} onChange={() => setFormData({...formData, ativo: false})} /> Inativo
            </label>
          </div>
        </div>

        {showCatSection && (
          <div className="inline-cat-section">
            <h4>Nova Categoria</h4>
            <div className="inline-cat-inputs">
              <input 
                type="text" 
                value={novaCatDesc} 
                onChange={e => setNovaCatDesc(e.target.value)} 
                placeholder="Nome da categoria"
              />
              <div className="inline-cat-buttons">
                <button type="button" className="btn-cat-save" onClick={handleAddCategory}>Criar</button>
                <button type="button" className="btn-cat-cancel" onClick={() => { setShowCatSection(false); setNovaCatDesc(''); }}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

        <div className="form-buttons">
          <button type="button" className="btn-secondary" onClick={() => setView('LIST')}>Cancelar</button>
          <button type="submit" className="btn-primary-save">Salvar Item</button>
        </div>
      </form>
    </div>
  );
}