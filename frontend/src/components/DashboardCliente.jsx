import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardCliente.css';

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      setErro('');
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3001/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Erro ao carregar dashboard');
        const data = await res.json();
        setDashboard(data);
      } catch (e) {
        setErro('Erro ao carregar dashboard.');
        setDashboard(null);
      }
      setLoading(false);
    }
    fetchDashboard();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (erro) return <div>{erro}</div>;
  if (!dashboard) return <div>Erro ao carregar dashboard.</div>;

  return (
    <div className="dashboard-bg">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <button
            className="dashboard-btn"
            onClick={() => navigate("/pedidoCliente")}
          >
            Novo Pedido
          </button>
          <button className="dashboard-btn secondary">View Profile</button>
        </div>
        <div className="dashboard-notice">
          <span className="dashboard-leaf">🍃</span>
          <div>
            <strong>System Notice</strong>
            <div>{dashboard.avisos?.[0]?.mensagem || 'Nenhum aviso.'}</div>
          </div>
        </div>
        <div className="dashboard-section">
          <h3>Pedidos Recentes</h3>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Status</th>
                <th>total</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.recentOrders?.length > 0 ? (
                dashboard.recentOrders.map((order, idx) => (
                  <tr key={idx}>
                    <td>{order.criado_em ? new Date(order.criado_em).toLocaleDateString() : '--'}</td>
                    <td>
                      <span className={`status ${order.status === 'cancelado' ? 'cancelled' : 'delivered'}`}>
                        {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : '--'}
                      </span>
                    </td>
                    <td>
                      {order.total ? order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '--'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>Nenhum pedido recente.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {dashboard.lastOrder && (
          <div className="dashboard-lastorder">
            <div>
              <strong>Ultimo Pedido</strong>
              <div>{dashboard.lastOrder.criado_em ? new Date(dashboard.lastOrder.criado_em).toLocaleDateString() : '--'}</div>
            </div>
            <div>
              <span className="lastorder-amount">
                {dashboard.lastOrder.total ? dashboard.lastOrder.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '--'}
              </span>
              <span className={`status ${dashboard.lastOrder.status === 'cancelado' ? 'cancelled' : 'delivered'}`}>
                {dashboard.lastOrder.status ? dashboard.lastOrder.status.charAt(0).toUpperCase() + dashboard.lastOrder.status.slice(1) : '--'}
              </span>
            </div>
             <button
              className="dashboard-btn lastorder-btn"
             onClick={() => navigate("/visualizaPedidoCliente")}>Produtos</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;