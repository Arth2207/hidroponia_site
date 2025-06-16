import React, { useEffect, useState } from "react";
import "./DashboardSeparador.css";

const API_URL = "http://localhost:3001";

export default function DashboardSeparador() {
  const [pedidos, setPedidos] = useState([]);
  const [aberto, setAberto] = useState({});
  const [detalhes, setDetalhes] = useState({});
  const [separados, setSeparados] = useState({});
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/separador/pedidos`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Erro ao buscar pedidos.");
        const data = await res.json();
        setPedidos(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        setPedidos([]);
        setErro(err.message);
      });
  }, []);

  const handleToggle = async (id) => {
    setAberto((prev) => ({ ...prev, [id]: !prev[id] }));
    // Se ainda não buscou os detalhes, busca agora
    if (!detalhes[id]) {
      try {
        const res = await fetch(`${API_URL}/separador/pedido/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Erro ao buscar detalhes do pedido.");
        const data = await res.json();
        setDetalhes((prev) => ({ ...prev, [id]: data.itens || [] }));
      } catch (err) {
        setDetalhes((prev) => ({ ...prev, [id]: [{ produto: "Erro ao carregar itens", quantidade: 0 }] }));
      }
    }
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
        <h2 className="separator-title">Pedidos de Todos os Restaurantes</h2>
        {erro && <div className="separator-error">{erro}</div>}
        <ul className="separator-list">
          {pedidos.length === 0 && !erro && (
            <li className="separator-empty">Nenhum pedido encontrado.</li>
          )}
          {pedidos.map((pedido) => (
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
                <span className="separator-nome">
                  Pedido #{pedido.pedido_id} - {pedido.restaurante ? `Restaurante: ${pedido.restaurante} - ` : ""}
                  {new Date(pedido.criado_em).toLocaleString("pt-BR")}
                </span>
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
                    {detalhes[pedido.pedido_id]
                      ? detalhes[pedido.pedido_id].map((item, idx) => (
                          <li key={idx}>
                            {item.quantidade}x {item.produto}
                          </li>
                        ))
                      : <li>Carregando itens...</li>
                    }
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