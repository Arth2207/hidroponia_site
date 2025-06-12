import React, { useState } from 'react';
import './SignUpForm.css';
import logo from '../assets/Logo.png';
import { cadastrarUsuario } from '../services/api';

function SignUpForm() {
  // Estados para cada campo do formulário
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [tipo, setTipo] = useState('cliente');
  const [senha, setSenha] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();
  const dados = { 
    nome, 
    restaurante_nome: nome, // preenche restaurante_nome com o valor de nome
    cnpj, 
    email, 
    tipo, 
    senha 
  };
  const resposta = await cadastrarUsuario(dados);
  if (resposta.error) {
    alert(resposta.error);
  } else {
    alert('Cadastro realizado com sucesso!');
    // Aqui você pode redirecionar ou limpar o formulário
  }
};

  return (
    <div className="signup-bg">
      <header className="landing-header">
        <img src={logo} alt="Logo" className="logo-img" />
      </header>
      <div className="signup-container">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2 className="signup-title">Cadastro</h2>
          <label className="signup-label">Nome</label>
          <input
            className="signup-input"
            type="text"
            placeholder="Digite seu nome"
            value={nome}
            onChange={e => setNome(e.target.value)}
          />

          <label className="signup-label">CNPJ</label>
          <input
            className="signup-input"
            type="text"
            placeholder="Digite seu CNPJ"
            value={cnpj}
            onChange={e => setCnpj(e.target.value)}
          />

          <label className="signup-label">Email</label>
          <input
            className="signup-input"
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <label className="signup-label">Tipo</label>
          <input
            className="signup-input"
            type="text"
            placeholder="Digite o tipo (cliente)"
            value={tipo}
            onChange={e => setTipo(e.target.value)}
          />

          <label className="signup-label">Senha</label>
          <input
            className="signup-input"
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
          />

          <button className="signup-btn" type="submit">Cadastrar</button>
          <div className="signup-footer">
            Already have an account?
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpForm;