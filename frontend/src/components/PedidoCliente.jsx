import React, { useEffect, useState } from "react";
import "./PedidoCliente.css";

const API_URL = "http://localhost:3001";

export default function OrderProducts() {
  const [produtos, setProdutos] = useState([]);
  const [quantidades, setQuantidades] = useState({});
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/produtos`)
      .then((res) => res.json())
      .then((data) => {
        // Se vier {produtos: [...]}, ajuste
        const lista = Array.isArray(data) ? data : data.produtos || [];
        setProdutos(lista);
        // Inicializa quantidades em 1
        const q = {};
        lista.forEach((p) => (q[p.id] = 1));
        setQuantidades(q);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const alterarQuantidade = (id, delta) => {
    setQuantidades((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  };

const handleConfirmar = () => {
  const itens = produtos
    .filter((p) => quantidades[p.id] > 0)
    .map((p) => ({
      produtoId: p.id,
      quantidade: quantidades[p.id],
    }));

  if (itens.length === 0) {
    setMensagem("Selecione ao menos um produto.");
    return;
  }

  fetch(`${API_URL}/pedido`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      itens,
      // data_entrega: ... // se quiser enviar data de entrega, adicione aqui
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      setMensagem(data.pedidoId ? "Pedido realizado com sucesso!" : "Erro ao salvar pedido.");
    })
    .catch(() => setMensagem("Erro ao salvar pedido."));
};

  return (
    <div className="order-bg">
      <div className="order-card">
        <h2 className="order-title">Order Products</h2>
        {loading ? (
          <div className="order-loading">Carregando...</div>
        ) : (
          <ul className="order-list">
            {produtos.map((p) => (
              <li className="order-item" key={p.id}>
                <div className="order-img">
                  {/* Imagem ilustrativa por nome, pode trocar por <img src=... /> */}
                  <span role="img" aria-label={p.nome}>
                    {p.nome.toLowerCase().includes("lettuce") && "🥬"}
                    {p.nome.toLowerCase().includes("spinach") && "🥗"}
                    {p.nome.toLowerCase().includes("tomato") && "🍅"}
                    {p.nome.toLowerCase().includes("carrot") && "🥕"}
                  </span>
                </div>
                <div className="order-info">
                  <span className="order-prod">{p.nome}</span>
                  <span className="order-price">
                    R$ {Number(p.preco).toFixed(2)}
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
            ))}
          </ul>
        )}
        <button className="order-confirm" onClick={handleConfirmar}>
          Confirm Order
        </button>
        {mensagem && <div className="order-msg">{mensagem}</div>}
      </div>
    </div>
  );
}