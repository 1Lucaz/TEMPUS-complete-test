import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

export default function Header({ isLoggedIn }) {
  return (
    <header className="header-container">
      <div className="header-content">
        
        <div className="logo-box">
          <span className="ampulheta">⏳</span>
          <div className="logo-text">
            <span className="letra">T</span>
            <span className="letra">E</span>
            <span className="letra">M</span>
            <span className="letra">P</span>
            <span className="letra">U</span>
            <span className="letra">S</span>
          </div>
        </div>
        
        {!isLoggedIn && (
          <nav className="nav-links">
            <a href="#gestao" className="nav-link">Gestão</a>
            <a href="#fluxo" className="nav-link">Fluxo de Trabalho</a>
            <a href="#cliente" className="nav-link">Acompanhamento</a>
          </nav>
        )}

        <div className="header-actions">
          {isLoggedIn ? (
            <Link to="/" className="btn-logout animate-hover" style={{ textDecoration: 'none' }}>
              Sair
            </Link>
          ) : (
            <>
              <Link to="/Login" className="btn-login animate-hover" style={{ textDecoration: 'none' }}>
                Entrar
              </Link>
              <Link to="/cadastro" className="btn-signup animate-hover" style={{ textDecoration: 'none' }}>
                Criar Conta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}