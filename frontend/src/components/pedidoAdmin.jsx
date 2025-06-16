import React, { useEffect, useState } from "react";
import "./pedidoAdmin.css";

const API_URL = "http://localhost:3001";

export default function AllOrders() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [aberto, setAberto] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/pedidos`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Erro ao buscar pedidos");
        const data = await res.json();
        setPedidos(Array.isArray(data) ? data : []);
      })
      .catch(() => setErro("Erro ao carregar pedidos"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="orders-bg">Carregando...</div>;
  if (erro) return <div className="orders-bg">{erro}</div>;

  return (
    <div className="orders-bg">
      <div className="orders-card">
        <h2 className="orders-title">Pedidos</h2>
        <div className="orders-list">
          {pedidos.length === 0 && <div className="orders-empty">Nenhum pedido encontrado.</div>}
          {pedidos.map((pedido) => (
            <div className={`order-item${aberto === (pedido.pedido_id || pedido.id) ? " order-item-open" : ""}`} key={pedido.pedido_id || pedido.id}>
              <div
                className={`order-header${aberto === (pedido.pedido_id || pedido.id) ? " order-header-open" : ""}`}
                onClick={() =>
                  setAberto(aberto === (pedido.pedido_id || pedido.id) ? null : (pedido.pedido_id || pedido.id))
                }
              >
                <span className="order-nome">{pedido.restaurante || "Restaurante"}</span>
                <span className="order-arrow">{aberto === (pedido.pedido_id || pedido.id) ? "▼" : "›"}</span>
              </div>
              {aberto === (pedido.pedido_id || pedido.id) && (
                <ItensPedido pedidoId={pedido.pedido_id || pedido.id} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ItensPedido({ pedidoId }) {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3001/pedido/${pedidoId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Erro ao buscar itens do pedido");
        const data = await res.json();
        setItens(Array.isArray(data) ? data : []);
      })
      .catch(() => setErro("Erro ao carregar itens"))
      .finally(() => setLoading(false));
  }, [pedidoId]);

  return (
    <div className="order-bar">
      {loading ? (
        <span>Carregando itens...</span>
      ) : erro ? (
        <span>{erro}</span>
      ) : itens.length > 0 ? (
        <ul className="order-bar-list">
          {itens.map((item) => (
            <li className="order-bar-item" key={item.produto_id || item.id}>
              <span className="order-bar-quant">{item.quantidade}x</span>
              <span className="order-bar-prod">{item.produto}</span>
              <span className="order-bar-preco">R$ {Number(item.preco).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <span>Nenhum item neste pedido.</span>
      )}
    </div>
  );
}