import React, { useEffect, useState } from "react";
import "./DashboardRelatorio.css";

const API_URL = "http://localhost:3001";

export default function DashboardRelatorio() {
  const [receitaRestaurantes, setReceitaRestaurantes] = useState([]);
  const [receitaProdutos, setReceitaProdutos] = useState([]);
  const [auditoria, setAuditoria] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const [finRes, audRes] = await Promise.all([
          fetch(`${API_URL}/financeiro/relatorio`, {
            headers: { Authorization: `Bearer ${token}` }
          }).then((r) => r.ok ? r.json() : { restaurantes: [], produtos: [] }),
          fetch(`${API_URL}/auditoria/log`, {
            headers: { Authorization: `Bearer ${token}` }
          }).then((r) => r.ok ? r.json() : { logs: [] }),
        ]);
        setReceitaRestaurantes(finRes.restaurantes || []);
        setReceitaProdutos(finRes.produtos || []);
        setAuditoria(audRes.logs || []);
      } catch {
        setReceitaRestaurantes([]);
        setReceitaProdutos([]);
        setAuditoria([]);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="relatorio-bg">
      <div className="relatorio-card">
        <header className="relatorio-header">
          <span>Relatório Financeiro</span>
          <div>
            <span className="relatorio-admin">Admin</span>
            <button className="relatorio-logout">Logout</button>
          </div>
        </header>
        <div className="relatorio-content">
          <section className="relatorio-section">
            <h3>Receita por Restaurante</h3>
            <table>
              <thead>
                <tr>
                  <th>Restaurante</th>
                  <th>Esta semana</th>
                  <th>Este mês</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={3}>Carregando...</td></tr>
                ) : receitaRestaurantes.length === 0 ? (
                  <tr><td colSpan={3}>Nenhum dado.</td></tr>
                ) : (
                  receitaRestaurantes.map((r, idx) => (
                    <tr key={idx}>
                      <td>{r.nome}</td>
                      <td>R$ {Number(r.semana).toLocaleString("pt-BR")}</td>
                      <td>R$ {Number(r.mes).toLocaleString("pt-BR")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
          <section className="relatorio-section">
            <h3>Receita por Produto</h3>
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Esta semana</th>
                  <th>Este mês</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={3}>Carregando...</td></tr>
                ) : receitaProdutos.length === 0 ? (
                  <tr><td colSpan={3}>Nenhum dado.</td></tr>
                ) : (
                  receitaProdutos.map((p, idx) => (
                    <tr key={idx}>
                      <td>{p.nome}</td>
                      <td>R$ {Number(p.semana).toLocaleString("pt-BR")}</td>
                      <td>R$ {Number(p.mes).toLocaleString("pt-BR")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
          <section className="relatorio-section">
            <h3>Log de Auditoria</h3>
            <div className="relatorio-auditoria">
              {loading ? (
                <div>Carregando...</div>
              ) : auditoria.length === 0 ? (
                <div>Nenhum log.</div>
              ) : (
                auditoria.map((log, idx) => (
                  <div className="auditoria-item" key={idx}>
                    <div>
                      <strong>{log.usuario || "Administrador"}</strong> {log.acao}
                    </div>
                    <div className="auditoria-data">
                      {log.data ? new Date(log.data).toLocaleString("pt-BR") : ""}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}