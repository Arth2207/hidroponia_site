import React, { useState } from 'react';
import './LoginForm.css';
import logo from '../assets/Logo.png';

function LoginForm() {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState('cliente'); // ou admin/funcionario, conforme seu sistema
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    try {
      const response = await fetch('http://localhost:3001/login', { // ajuste a URL se necessário
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, senha, tipo })
      });
      const data = await response.json();
      if (response.ok) {
        // Salve o token no localStorage ou contexto
        localStorage.setItem('token', data.token);
        // Redirecione ou atualize o estado do app
        window.location.href = '/dashboard'; // ajuste para sua rota
      } else {
        setErro(data.error || 'Erro ao fazer login');
      }
    } catch (err) {
      setErro('Erro de conexão com o servidor');
    }
  };

  return (
    <div className="login-bg">
      <header className="landing-heaader">
        <img src={logo} alt="Logo" className="logos-img" />
      </header>
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit}>
          <label className="login-label">Nome</label>
          <input className="login-input" type="text" value={nome} onChange={e => setNome(e.target.value)} />

          <label className="login-label">Senha</label>
          <input className="login-input" type="password" value={senha} onChange={e => setSenha(e.target.value)} />

          <label className="login-label">Tipo</label>
          <select className="login-input" value={tipo} onChange={e => setTipo(e.target.value)}>
            <option value="cliente">Cliente</option>
            <option value="admin">Admin</option>
            <option value="funcionario">Funcionário</option>
          </select>

          <button className="login-btn" type="submit">Login</button>
        </form>
        {erro && <div style={{ color: 'red', marginTop: 8 }}>{erro}</div>}
        <div className="login-footer">
          Não tem conta?
        </div>
      </div>
    </div>
  );
}

export default LoginForm;