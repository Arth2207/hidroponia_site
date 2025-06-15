import React, { useEffect, useState } from 'react';
import './DashboardAdmin.css';
import { useNavigate } from "react-router-dom";





function DashboardAdmin() {
    const navigate = useNavigate();
  const [avisos, setAvisos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdminDashboard() {
      setLoading(true);
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:3001/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setAvisos(data.avisos || []);
        setPedidos(data.recentOrders || []);
      } catch (err) {
        setAvisos([]);
        setPedidos([]);
      }
      setLoading(false);
    }
    fetchAdminDashboard();
  }, []);


  return (
    <div className="admin-bg">
      <div className="admin-dashboard">
        <aside className="admin-sidebare">
          <h2 className="admin-title">Admin Dashboard</h2>
          <nav>
            <ul>
              <li className="active"><span>👤</span> Painel Principal</li>
              <li  style={{ cursor: "pointer" }}
                onClick={() => navigate("/usuariosAdmin")}
              ><span>👥</span> Gestão de Usuarios</li>
              <li  style={{ cursor: "pointer" }}
                onClick={() => navigate("/restaurantesAdmin")}
              >
                <span className="icon">▤</span> Gestão de Restaurantes
              </li>
              <li><span>🛒</span> Gestão de Pedidos</li>
              <li
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/produtosAdmin")}
              >
                <span className="icon">▤</span> Gestão de Produtos
              </li>
              <li><span>📢</span> Avisos do Sistema</li>
              <li  style={{ cursor: "pointer" }}
                onClick={() => navigate("/relatorioAdmin")}
              ><span>📊</span> Relatórios e Auditoria</li>
            </ul>
          </nav>
        </aside>
        <main className="admin-main">
          <header className="admin-header">
            <span className="admin-user">Admin</span>
            <button className="admin-logout">Logout</button>
          </header>
          <section className="admin-section">
            <h3>Sistema de Avisos</h3>
            {loading ? (
              <div>Carregando...</div>
            ) : avisos.length > 0 ? (
              <div className="admin-aviso">
                <span className="admin-aviso-icon">📢</span>
                <div>
                  <strong>{avisos[0].titulo || 'Aviso do Sistema'}</strong>
                  <div>{avisos[0].mensagem}</div>
                </div>
              </div>
            ) : (
              <div>Nenhum aviso.</div>
            )}
          </section>
          <section className="admin-section">
            <h3>Pedidos Recentes</h3>
            {loading ? (
              <div>Carregando...</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Restaurante</th>
                    <th>Status</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.length === 0 && (
                    <tr>
                      <td colSpan={4}>Nenhum pedido encontrado.</td>
                    </tr>
                  )}
                  {pedidos.map((pedido, idx) => (
                    <tr key={idx}>
                      <td>{new Date(pedido.criado_em).toLocaleDateString('pt-BR')}</td>
                      <td>{pedido.restaurante}</td>
                      <td>
                        <span className={`status ${pedido.status.toLowerCase().replace(' ', '-')}`}>
                          {pedido.status}
                        </span>
                      </td>
                      <td>
                        R$ {Number(pedido.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default DashboardAdmin;