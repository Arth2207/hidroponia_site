import React, { useEffect, useState } from "react";
import "./DashboardUsuarios.css";

const API_URL = "http://localhost:3001";

export default function DashboardUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [showCadastro, setShowCadastro] = useState(false);
  const [showEdicao, setShowEdicao] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", tipo: "usuario", status: "Ativo" });
  const [editIndex, setEditIndex] = useState(null);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  // Listar usuários
  useEffect(() => {
    fetch(`${API_URL}/usuarios`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(setUsuarios);
  }, []);

  // Cadastrar usuário
  const handleCadastro = (e) => {
    e.preventDefault();
    fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then((novo) => {
        setUsuarios((prev) => [...prev, novo.usuario || novo]);
        setShowCadastro(false);
        setForm({ nome: "", email: "", tipo: "usuario", status: "Ativo" });
      });
  };

  // Abrir edição
  const handleEditClick = (idx) => {
    setEditIndex(idx);
    setForm({
      nome: usuarios[idx].nome,
      email: usuarios[idx].email,
      tipo: usuarios[idx].tipo,
      status: usuarios[idx].status,
    });
    setShowEdicao(true);
  };

  // Salvar edição
  const handleSalvarEdicao = (e) => {
    e.preventDefault();
    const usuario = usuarios[editIndex];
    fetch(`${API_URL}/usuarios/${usuario.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then((atualizado) => {
        const novos = [...usuarios];
        novos[editIndex] = atualizado.usuario || atualizado;
        setUsuarios(novos);
        setEditIndex(null);
        setShowEdicao(false);
      });
  };

  // Excluir usuário selecionado
  const handleExcluirSelecionado = () => {
    if (!usuarioSelecionado) {
      alert("Selecione um usuário na tabela para excluir.");
      return;
    }
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return;
    fetch(`${API_URL}/usuarios/${usuarioSelecionado.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(() => {
        setUsuarios((prev) => prev.filter((u) => u.id !== usuarioSelecionado.id));
        setUsuarioSelecionado(null);
      });
  };

  return (
    <div className="admin-bg">
      <div className="admin-dashboard-container">
        <aside className="admin-sidebar">
          <h2>Admin Dashboard</h2>
          <nav>
            <ul>
              <li className="active">
                <span className="icon">≡</span> Listagem
              </li>
              <li
                style={{ cursor: "pointer" }}
                onClick={() => setShowCadastro(true)}
              >
                <span className="icon">＋</span> Cadastro
              </li>
              <li
                style={{ cursor: "pointer" }}
                onClick={handleExcluirSelecionado}
              >
                <span className="icon">🗑</span> Exclusão
              </li>
            </ul>
          </nav>
        </aside>
        <main className="admin-main">
          <header className="admin-header">
            <span className="admin-user">Admin</span>
            <button className="admin-logout">Logout</button>
          </header>
          <section className="admin-section">
            <h2>Gestão de Usuários</h2>
            <div className="admin-table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u, idx) => (
                    <tr
                      key={u.id || idx}
                      className={usuarioSelecionado && usuarioSelecionado.id === u.id ? "linha-selecionada" : ""}
                      onClick={() => setUsuarioSelecionado(u)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{u.nome}</td>
                      <td>{u.email}</td>
                      <td>{u.status || (u.tipo === "admin" ? "Admin" : u.tipo === "usuario" ? "Usuário" : u.tipo)}</td>
                      <td>
                        <button
                          className="admin-action-btn"
                          title="Editar"
                          onClick={e => { e.stopPropagation(); handleEditClick(idx); }}
                        >
                          <span role="img" aria-label="editar">✏️</span>
                        </button>
                        {/* Botão de exclusão removido da tabela */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {/* Modal de cadastro */}
      {showCadastro && (
        <div className="admin-modal-bg">
          <form className="admin-modal-form" onSubmit={handleCadastro}>
            <h3>Cadastrar Usuário</h3>
            <label>Nome</label>
            <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required />
            <label>E-mail</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <label>Tipo</label>
            <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
              <option value="admin">Admin</option>
              <option value="usuario">Usuário</option>
              <option value="cliente">Cliente</option>
            </select>
            <label>Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
            <div className="admin-modal-actions">
              <button type="submit" className="admin-save-btn">Cadastrar</button>
              <button type="button" className="admin-cancel-btn" onClick={() => setShowCadastro(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Modal de edição */}
      {showEdicao && (
        <div className="admin-modal-bg">
          <form className="admin-modal-form" onSubmit={handleSalvarEdicao}>
            <h3>Editar Usuário</h3>
            <label>Nome</label>
            <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required />
            <label>E-mail</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <label>Tipo</label>
            <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
              <option value="admin">Admin</option>
              <option value="usuario">Usuário</option>
              <option value="cliente">Cliente</option>
            </select>
            <label>Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
            <div className="admin-modal-actions">
              <button type="submit" className="admin-save-btn">Salvar</button>
              <button type="button" className="admin-cancel-btn" onClick={() => setShowEdicao(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}