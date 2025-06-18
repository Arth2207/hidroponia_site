import React, { useState, useEffect, useCallback } from "react";
import "./produtosAdmin.css";

const API_URL = "http://localhost:3001";

export default function ProdutosAdmin() {
  // --- Estados do Componente ---
  const [produtos, setProdutos] = useState([]);
  const [restaurantes, setRestaurantes] = useState([]);
  const [restauranteBusca, setRestauranteBusca] = useState("");
  const [restauranteSelecionado, setRestauranteSelecionado] = useState(null);
  
  // Estados para os formulários
  const [showCadastro, setShowCadastro] = useState(false);
  const [formCadastro, setFormCadastro] = useState({ nome: "", preco: "", unidade: "UN" });
  const [editIndex, setEditIndex] = useState(null);
  const [formEdicao, setFormEdicao] = useState({ nome: "", preco: "" });

  // Estados para feedback ao usuário
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- Lógica de API ---

  // Função centralizada para fazer chamadas de API com autenticação
  const apiFetch = useCallback(async (url, options = {}) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Sessão inválida. Faça login novamente.");
      throw new Error("Token não encontrado");
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401 || response.status === 403) {
      setError("Acesso negado. Verifique suas permissões ou faça login novamente.");
      throw new Error("Não autorizado");
    }
    if (!response.ok) {
      const errData = await response.json().catch(() => ({ error: "Erro desconhecido na API" }));
      throw new Error(errData.error || "Erro na requisição");
    }
    return response.json();
  }, []);

  // Carrega a lista de produtos (geral ou por restaurante)
  useEffect(() => {
    const fetchProdutos = async () => {
      setLoading(true);
      setError("");
      try {
        let data;
        if (restauranteSelecionado) {
          data = await apiFetch(`${API_URL}/produtos/restaurante/${restauranteSelecionado.id}`);
        } else {
          data = await apiFetch(`${API_URL}/produtos`);
        }
        setProdutos(data.produtos || data || []);
      } catch (err) {
        setError(err.message);
        setProdutos([]); // Limpa a lista em caso de erro
      } finally {
        setLoading(false);
      }
    };
    fetchProdutos();
  }, [restauranteSelecionado, apiFetch]);

  // Pesquisa por restaurantes
  useEffect(() => {
    if (restauranteBusca.length < 2) {
      setRestaurantes([]);
      return;
    }
    const fetchRestaurantes = async () => {
      try {
        const data = await apiFetch(`${API_URL}/restaurantes?nome=${restauranteBusca}`);
        setRestaurantes(data || []);
      } catch (err) {
        setRestaurantes([]);
      }
    };
    const debounce = setTimeout(fetchRestaurantes, 300);
    return () => clearTimeout(debounce);
  }, [restauranteBusca, apiFetch]);

  // --- Handlers de Eventos ---

  const handleCadastro = async (e) => {
    e.preventDefault();
    try {
      const novoProduto = await apiFetch(`${API_URL}/produtos`, {
        method: "POST",
        body: JSON.stringify({
          nome: formCadastro.nome,
          preco: Number(formCadastro.preco),
          unidade: formCadastro.unidade,
        }),
      });
      setProdutos((prev) => [...prev, novoProduto.produto || novoProduto]);
      setShowCadastro(false);
      setFormCadastro({ nome: "", preco: "", unidade: "UN" });
    } catch (err) {
      setError(`Erro ao cadastrar: ${err.message}`);
    }
  };

  const handleEditClick = (idx) => {
    const produto = produtos[idx];
    setEditIndex(idx);
    setFormEdicao({ nome: produto.nome, preco: produto.preco });
  };

 const handleSalvarEdicao = async (e) => {
  e.preventDefault();
  const produto = produtos[editIndex];
  try {
    if (restauranteSelecionado) {
      // Salva preço personalizado
      await apiFetch(`${API_URL}/admin/produtos/${produto.id}/restaurante/${restauranteSelecionado.id}/preco`, {
        method: "PUT",
        body: JSON.stringify({ preco: Number(formEdicao.preco) }),
      });
      // ATUALIZA a lista personalizada após salvar
      const data = await apiFetch(`${API_URL}/produtos/restaurante/${restauranteSelecionado.id}`);
      setProdutos(data.produtos || data || []);
    } else {
      // Salva preço global
      await apiFetch(`${API_URL}/produtos/${produto.id}`, {
        method: "PUT",
        body: JSON.stringify({
          nome: formEdicao.nome,
          preco: Number(formEdicao.preco),
          unidade: produto.unidade,
        }),
      });
      // Atualiza localmente
      const produtosAtualizados = [...produtos];
      produtosAtualizados[editIndex] = { ...produto, ...formEdicao };
      setProdutos(produtosAtualizados);
    }
    setEditIndex(null);
  } catch (err) {
    setError(`Erro ao salvar: ${err.message}`);
  }
};
  // --- Renderização do Componente ---
  return (
    <div className="dashboard-bg">
      <div className="dashboard-container">
        <aside className="sidebar">
          <h2>Hortaliças</h2>
          <nav>
            <ul>
              <li><span className="icon">≡</span> Listagem</li>
              <li onClick={() => setShowCadastro(true)}><span className="icon">＋</span> Cadastro</li>
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
                  <li key={r.id} onClick={() => {
                    setRestauranteSelecionado(r);
                    setRestauranteBusca(r.nome);
                    setRestaurantes([]);
                  }}>
                    {r.nome}
                  </li>
                ))}
              </ul>
            )}
            {restauranteSelecionado && (
              <div className="restaurante-selecionado">
                Preços para: {restauranteSelecionado.nome}{" "}
                <button onClick={() => setRestauranteSelecionado(null)}>Limpar</button>
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
          {error && <div className="error-message">{error}</div>}
          <div className="produtos-table">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Preço</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="3">Carregando...</td></tr>
                ) : (
                  produtos.map((p, idx) => (
                    <React.Fragment key={p.id || idx}>
                      <tr>
                        <td>{p.nome}</td>
                        <td>R$ {Number(p.preco).toFixed(2)}</td>
                        <td>
                          <button className="edit-btn" title="Editar" onClick={() => handleEditClick(idx)}>✎</button>
                        </td>
                      </tr>
                      {editIndex === idx && (
                        <tr className="edit-row">
                          <td colSpan={3}>
                            <form className="edit-form" onSubmit={handleSalvarEdicao}>
                              <input name="nome" value={formEdicao.nome} onChange={(e) => setFormEdicao({ ...formEdicao, nome: e.target.value })} required disabled={!!restauranteSelecionado} />
                              <input name="preco" type="number" step="0.01" value={formEdicao.preco} onChange={(e) => setFormEdicao({ ...formEdicao, preco: e.target.value })} required />
                              <button type="submit" className="save-btn">Salvar</button>
                              <button type="button" className="cancel-btn" onClick={() => setEditIndex(null)}>Cancelar</button>
                            </form>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {showCadastro && (
            <div className="cadastro-modal">
              <form className="cadastro-form" onSubmit={handleCadastro}>
                <h2>Cadastrar Novo Produto</h2>
                <input name="nome" placeholder="Nome do produto" value={formCadastro.nome} onChange={(e) => setFormCadastro({ ...formCadastro, nome: e.target.value })} required />
                <input name="preco" type="number" step="0.01" placeholder="Preço (ex: 12.50)" value={formCadastro.preco} onChange={(e) => setFormCadastro({ ...formCadastro, preco: e.target.value })} required />
                <div className="edit-form-actions">
                  <button type="submit" className="save-btn">Cadastrar</button>
                  <button type="button" className="cancel-btn" onClick={() => setShowCadastro(false)}>Cancelar</button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}