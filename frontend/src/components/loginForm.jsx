import React, { useState } from 'react';
import './LoginForm.css';
import logo from '../assets/Logo.png';
import { useNavigate } from "react-router-dom";



const API_URL = "http://localhost:3001";

export default function Login() {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro("");
    fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, senha, tipo }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erro ao fazer login");
        localStorage.setItem("token", data.token);
        localStorage.setItem("tipo", data.usuario.tipo);
        localStorage.setItem("nome", data.usuario.nome);

        // Redirecionamento conforme o tipo
        if (data.usuario.tipo === "admin") {
          navigate("/DashboardAdmin");
        } else if (data.usuario.tipo === "cliente") {
          navigate("/dashboardCliente");
        } else {
          // Redirecione para outra página se desejar
          setErro("Tipo de usuário não reconhecido.");
        }
      })
      .catch((err) => setErro(err.message));
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
