import React, { useEffect, useState } from 'react';
import './DashboardCliente.css';

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setDashboard(data);
      setLoading(false);
    }
    fetchDashboard();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (!dashboard) return <div>Erro ao carregar dashboard.</div>;

  return (
    <div className="dashboard-bg">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <button className="dashboard-btn">New Order</button>
          <button className="dashboard-btn secondary">View Profile</button>
        </div>
        <div className="dashboard-notice">
          <span className="dashboard-leaf">🍃</span>
          <div>
            <strong>System Notice</strong>
            <div>{dashboard.avisos[0]?.mensagem || 'Nenhum aviso.'}</div>
          </div>
        </div>
        <div className="dashboard-section">
          <h3>Recent Orders</h3>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.recentOrders.map((order, idx) => (
                <tr key={idx}>
                  <td>{new Date(order.criado_em).toLocaleDateString()}</td>
                  <td>
                    <span className={`status ${order.status === 'cancelado' ? 'cancelled' : 'delivered'}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    {order.total ? order.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '--'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {dashboard.lastOrder && (
          <div className="dashboard-lastorder">
            <div>
              <strong>Last Order</strong>
              <div>{new Date(dashboard.lastOrder.criado_em).toLocaleDateString()}</div>
            </div>
            <div>
              <span className="lastorder-amount">
                {dashboard.lastOrder.total ? dashboard.lastOrder.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '--'}
              </span>
              <span className={`status ${dashboard.lastOrder.status === 'cancelado' ? 'cancelled' : 'delivered'}`}>
                {dashboard.lastOrder.status.charAt(0).toUpperCase() + dashboard.lastOrder.status.slice(1)}
              </span>
            </div>
            <button className="dashboard-btn lastorder-btn">Peroucts</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;