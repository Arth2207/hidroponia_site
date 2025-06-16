import React, { useEffect, useState } from "react";
import "./VisualizaPedidoCliente.css";

export default function VisualizaPedidoCliente() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3001/pedido/ultimo", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error();
        const data = await res.json();
        setItens(Array.isArray(data) ? data : []);
      })
      .catch(() => setErro("Erro ao buscar pedido."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="pedido-bg"><div className="pedido-card">Carregando...</div></div>;
  if (erro) return <div className="pedido-bg"><div className="pedido-card error">{erro}</div></div>;
  if (!itens.length) return <div className="pedido-bg"><div className="pedido-card">Nenhum pedido encontrado.</div></div>;

  return (
    <div className="pedido-bg">
      <div className="pedido-card">
        <h2 className="pedido-title">Detalhes do Pedido</h2>
        <div className="pedido-tabela">
          <div className="pedido-tabela-header">
            <span>Item</span>
            <span>Qtd</span>
          </div>
          {itens.map((item) => (
            <div className="pedido-tabela-row" key={item.id || item.produto_id}>
              <span className="pedido-produto">{item.produto || item.produto_nome}</span>
              <span className="pedido-qtd">{item.quantidade}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}