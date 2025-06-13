import React, { useState, useEffect } from "react";
import "./produtosAdmin.css";

const API_URL = "http://localhost:3001";

export default function ProdutosAdmin() {
  const [produtos, setProdutos] = useState([]);
  const [showCadastro, setShowCadastro] = useState(false);
  const [form, setForm] = useState({ nome: "", preco: "" });
  const [restaurantes, setRestaurantes] = useState([]);
  const [restauranteBusca, setRestauranteBusca] = useState("");
  const [restauranteSelecionado, setRestauranteSelecionado] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editForm, setEditForm] = useState({ nome: "", preco: "" });

  // Carrega produtos base ou personalizados
  useEffect(() => {
    if (restauranteSelecionado) {
      fetch(`${API_URL}/produtos/restaurante/${restauranteSelecionado.id}`)
        .then((res) => res.json())
        .then(setProdutos);
    } else {
      fetch(`${API_URL}/produtos`)
        .then((res) => res.json())
        .then((data) => setProdutos(data.produtos || []));
    }
  }, [restauranteSelecionado]);

  // Pesquisa restaurantes
  useEffect(() => {
    if (restauranteBusca.length > 1) {
      fetch(`${API_URL}/restaurantes?nome=${restauranteBusca}`)
        .then((res) => {
          if (!res.ok) return [];
          return res.json();
        })
        .then(setRestaurantes)
        .catch(() => setRestaurantes([]));
    } else {
      setRestaurantes([]);
    }
  }, [restauranteBusca]);

  // Cadastro de produto
  const handleCadastro = (e) => {
    e.preventDefault();
    fetch(`${API_URL}/produtos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: form.nome,
        preco: Number(form.preco),
        unidade: "UN",
      }),
    })
      .then((res) => res.json())
      .then((novo) => {
        setProdutos((prev) => [...prev, novo.produto || novo]);
        setShowCadastro(false);
        setForm({ nome: "", preco: "" });
      });
  };

  // Abrir edição
  const handleEditClick = (idx) => {
    const produto = produtos[idx];
    setEditIndex(idx);
    setEditForm({
      nome: produto.nome,
      preco: produto.preco,
    });
  };

  // Salvar edição (preço personalizado ou global)
  const handleSalvarEdicao = (e) => {
    e.preventDefault();
    const produto = produtos[editIndex];
    if (restauranteSelecionado) {
      // Salva preço personalizado
      fetch(
        `${API_URL}/admin/produtos/${produto.id}/restaurante/${restauranteSelecionado.id}/preco`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ preco: Number(editForm.preco) }),
        }
      )
        .then((res) => res.json())
        .then(() => {
          const novos = [...produtos];
          novos[editIndex] = { ...produto, preco: editForm.preco };
          setProdutos(novos);
          setEditIndex(null);
        });
    } else {
      // Salva preço global
      fetch(`${API_URL}/produtos/${produto.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: editForm.nome,
          preco: Number(editForm.preco),
          unidade: "UN",
        }),
      })
        .then((res) => res.json())
        .then((atualizado) => {
          const novos = [...produtos];
          novos[editIndex] = atualizado.produto || atualizado;
          setProdutos(novos);
          setEditIndex(null);
        });
    }
  };

  return (
    <div className="dashboard-bg">
      <div className="dashboard-container">
        <aside className="sidebar">
          <h2>Hortaliças</h2>
          <nav>
            <ul>
              <li>
                <span className="icon">≡</span> Listagem
              </li>
              <li
                className={showCadastro ? "active" : ""}
                onClick={() => setShowCadastro(true)}
              >
                <span className="icon">＋</span> Cadastro
              </li>
              <li>
                <span className="icon">▤</span> Produto
              </li>
            </ul>
          </nav>
          <div className="sidebar-pesquisa">
            <input
              type="text"
              placeholder="Pesquisar restaurante..."
              value={restauranteBusca}
              onChange={(e) => setRestauranteBusca(e.target.value)}
            />
            {restaurantes.length > 0 && (
              <ul className="restaurantes-lista">
                {restaurantes.map((r) => (
                  <li
                    key={r.id}
                    onClick={() => {
                      setRestauranteSelecionado(r);
                      setRestauranteBusca(r.nome);
                      setRestaurantes([]);
                    }}
                  >
                    {r.nome}
                  </li>
                ))}
              </ul>
            )}
            {restauranteSelecionado && (
              <div className="restaurante-selecionado">
                Restaurante: {restauranteSelecionado.nome}{" "}
                <button onClick={() => setRestauranteSelecionado(null)}>
                  Limpar
                </button>
              </div>
            )}
          </div>
        </aside>
        <main className="main-content">
          <header className="header">
            <span>Admin</span>
            <button className="logout-btn">Logout</button>
          </header>
          <h1>Gestão de Produtos</h1>
          <div className="produtos-table">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Preço</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((p, idx) => (
                  <React.Fragment key={p.id || idx}>
                    <tr className={editIndex === idx ? "selected-row" : ""}>
                      <td>{p.nome}</td>
                      <td>R$ {Number(p.preco).toFixed(2)}</td>
                      <td>
                        <button
                          className="edit-btn"
                          title="Editar"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(idx);
                          }}
                        >
                          ✎
                        </button>
                      </td>
                    </tr>
                    {editIndex === idx && (
                      <tr className="edit-row" key={`edit-${p.id || idx}`}>
                        <td colSpan={3}>
                          <form
                            className="edit-form"
                            onSubmit={handleSalvarEdicao}
                          >
                            <div>
                              <label>Nome:</label>
                              <input
                                name="nome"
                                value={editForm.nome}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    nome: e.target.value,
                                  })
                                }
                                required
                                disabled={!!restauranteSelecionado}
                              />
                            </div>
                            <div>
                              <label>Preço:</label>
                              <input
                                name="preco"
                                type="number"
                                step="0.01"
                                value={editForm.preco}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    preco: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                            <div className="edit-form-actions">
                              <button type="submit" className="save-btn">
                                Salvar
                              </button>
                              <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => setEditIndex(null)}
                              >
                                Cancelar
                              </button>
                            </div>
                          </form>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          {showCadastro && (
            <div className="cadastro-modal">
              <form className="cadastro-form" onSubmit={handleCadastro}>
                <h2>Cadastrar Produto</h2>
                <div>
                  <label>Nome:</label>
                  <input
                    name="nome"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label>Preço:</label>
                  <input
                    name="preco"
                    type="number"
                    step="0.01"
                    value={form.preco}
                    onChange={(e) => setForm({ ...form, preco: e.target.value })}
                    required
                  />
                </div>
                <div className="edit-form-actions">
                  <button type="submit" className="save-btn">
                    Cadastrar
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowCadastro(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}