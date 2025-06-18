import React, { useEffect, useState } from "react";
import "./PedidoCliente.css";

const API_URL = "http://localhost:3001";

export default function OrderProducts() {
  const [produtos, setProdutos] = useState([]);
  const [quantidades, setQuantidades] = useState({});
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState("");

  // Busca os produtos com o preço correto para o cliente logado
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Se não houver token, não é possível buscar os produtos
    if (!token) {
      setLoading(false);
      setMensagem("Por favor, faça login para ver os produtos.");
      return;
    }

    // CORREÇÃO: Adicionado o header 'Authorization' para autenticar a requisição
    fetch(`${API_URL}/cliente/produtos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) throw new Error("Sessão expirada. Faça login novamente.");
        if (!res.ok) throw new Error("Não foi possível carregar os produtos.");
        return res.json();
      })
      .then((data) => {
        setProdutos(data);
        // Inicializa as quantidades de todos os produtos como 1
        const q = {};
        data.forEach((p) => (q[p.id] = 1));
        setQuantidades(q);
      })
      .catch((err) => {
        setMensagem(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Altera a quantidade de um produto no carrinho
  const alterarQuantidade = (id, delta) => {
    setQuantidades((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta), // Garante que a quantidade não seja menor que 1
    }));
  };

  // Envia o pedido para o backend
  const handleConfirmar = () => {
    setMensagem("Enviando pedido...");
    const token = localStorage.getItem("token");

    const itens = produtos
      .filter((p) => quantidades[p.id] > 0)
      .map((p) => ({
        produtoId: p.id,
        quantidade: quantidades[p.id],
      }));

    if (itens.length === 0) {
      setMensagem("Selecione ao menos um produto para fazer o pedido.");
      return;
    }

    // CORREÇÃO: A rota para criar um pedido é '/pedido', e não '/cliente/produtos'
    fetch(`${API_URL}/pedido`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ itens }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao registrar o pedido.");
        return res.json();
      })
      .then((data) => {
        if (data.pedidoId) {
          setMensagem(`Pedido #${data.pedidoId} realizado com sucesso!`);
          // Opcional: Limpar o carrinho ou redirecionar o usuário
          setProdutos([]);
        } else {
          throw new Error(data.error || "Ocorreu um erro desconhecido.");
        }
      })
      .catch((err) => {
        setMensagem(err.message);
      });
  };

  return (
    <div className="order-bg">
      <div className="order-card">
        <h2 className="order-title">Faça seu Pedido</h2>
        {mensagem && <div className="order-msg">{mensagem}</div>}
        {loading ? (
          <div className="order-loading">Carregando produtos...</div>
        ) : (
          <>
            <ul className="order-list">
              {produtos.length > 0 ? (
                produtos.map((p) => (
                  <li className="order-item" key={p.id}>
                    <div className="order-info">
                      <span className="order-prod">{p.nome}</span>
                      <span className="order-price">
                        R$ {Number(p.preco).toFixed(2)} / {p.unidade}
                      </span>
                    </div>
                    <div className="order-qty">
                      <button
                        className="order-btn"
                        onClick={() => alterarQuantidade(p.id, -1)}
                      >
                        –
                      </button>
                      <span className="order-qtd">{quantidades[p.id] || 1}</span>
                      <button
                        className="order-btn"
                        onClick={() => alterarQuantidade(p.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                !mensagem && <li>Nenhum produto disponível no momento.</li>
              )}
            </ul>
            {produtos.length > 0 && (
              <button className="order-confirm" onClick={handleConfirmar}>
                Confirmar Pedido
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}