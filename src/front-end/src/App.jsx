import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import './styles/global.css'; 
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import Dashboard  from './pages/Dashboard';

function App() { 
  return (
    //add novas telas criadas aqui
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path='/Cadastro' element={<Cadastro/>  }/>
      <Route path='/Login' element={<Login/> }/>
      <Route path='/Dashboard' element= {<Dashboard/>} />

  
    </Routes>
  );
}

export default App;