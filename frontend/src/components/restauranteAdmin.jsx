import React, { useState, useEffect } from "react";
import "./restauranteAdmin.css";

const API_URL = "http://localhost:3001";

export default function RestaurantesAdmin() {
  const [restaurantes, setRestaurantes] = useState([]);

  // Carregar restaurantes
  useEffect(() => {
    fetch(`${API_URL}/restaurantes`)
      .then((res) => res.json())
      .then(setRestaurantes);
  }, []);

  // Excluir restaurante
  const handleExcluir = (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este restaurante?")) return;
    fetch(`${API_URL}/restaurantes/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        setRestaurantes((prev) => prev.filter((r) => r.id !== id));
      });
  };

  return (
    <div className="dashboard-bg">
      <div className="dashboard-container">
        <aside className="sidebar">
          <h2>Restaurantes</h2>
          <nav>
            <ul>
              <li>
                <span className="icon">≡</span> Listagem
              </li>
            </ul>
          </nav>
        </aside>
        <main className="main-content">
          <header className="header">
            <span>Admin</span>
            <button className="logout-btn">Logout</button>
          </header>
          <h1>Gestão de Restaurantes</h1>
          <div className="restaurantes-table">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {restaurantes.map((r, idx) => (
                  <tr key={r.id || idx}>
                    <td>{r.nome}</td>
                    <td>
                      <button
                        className="delete-btn"
                        title="Excluir"
                        onClick={() => handleExcluir(r.id)}
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}