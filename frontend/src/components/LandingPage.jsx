import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import logo from '../assets/Logo.png';

function LandingPage() {
  const navigate = useNavigate();

  const handlePedidoClick = () => {
    navigate('/login');
  };

  return (
    <div className="landing-bg">
     <header className="landing-headers">
        <img src={logo} alt="Logo" className="loggo-img" />
      </header>
      <div className="landing-card">
        <h1 className="landing-title">
          Faça seu pedido de<br />Hortaliças conosco
        </h1>
        <p className="landing-desc">
          Nós da hortaliças Bom jardim temos<br />
          o prazer de oferecer as melhores verduras para vocês
        </p>
        <button className="landing-btn" onClick={handlePedidoClick}>Fazer Pedido</button>

        <div className="landing-logo">
        
        </div>
        <div className="landing-lettuce"></div>
      </div>
    </div>
  );
}

export default LandingPage;