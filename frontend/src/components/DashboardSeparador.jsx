import React, { useEffect, useState } from "react";
import "./DashboardSeparador.css";

const API_URL = "http://localhost:3001"; // ajuste se necessário

export default function OrderSeparator() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [aberto, setAberto] = useState({});
  const [separados, setSeparados] = useState({});
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/separador/pedidos`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Erro ao buscar pedidos. Verifique seu acesso.");
        }
        const data = await res.json();
        setRestaurantes(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        setRestaurantes([]);
        setErro(err.message);
      });
  }, []);

  const handleToggle = (id) => {
    setAberto((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSeparar = (id) => {
    fetch(`${API_URL}/separador/pedido/${id}/separar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(() => {
      setSeparados((prev) => ({ ...prev, [id]: true }));
    });
  };

  return (
    <div className="separator-bg">
      <div className="separator-card">
        <h2 className="separator-title">Order Separator</h2>
        {erro && <div className="separator-error">{erro}</div>}
        <ul className="separator-list">
          {restaurantes.length === 0 && !erro && (
            <li className="separator-empty">Nenhum pedido encontrado.</li>
          )}
          {restaurantes.map((pedido) => (
            <li
              key={pedido.pedido_id}
              className={`separator-item${separados[pedido.pedido_id] ? " checked" : ""}`}
            >
              <div className="separator-row">
                <button
                  className={`separator-check${separados[pedido.pedido_id] ? " checked" : ""}`}
                  onClick={() => handleSeparar(pedido.pedido_id)}
                  disabled={separados[pedido.pedido_id]}
                  title={separados[pedido.pedido_id] ? "Pedido já separado" : "Marcar como separado"}
                >
                  {separados[pedido.pedido_id] ? "✔" : "○"}
                </button>
                <span className="separator-nome">{pedido.restaurante}</span>
                <button
                  className="separator-arrow"
                  onClick={() => handleToggle(pedido.pedido_id)}
                  aria-label="Ver detalhes"
                >
                  {aberto[pedido.pedido_id] ? "▲" : "▶"}
                </button>
              </div>
              {aberto[pedido.pedido_id] && (
                <div className="separator-details">
                  <ul>
                    {pedido.itens?.map((item, idx) => (
                      <li key={idx}>
                        {item.quantidade}x {item.produto}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}