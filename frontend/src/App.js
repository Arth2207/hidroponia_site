import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage.jsx';
import SignUpForm from './components/SignUpForm.jsx';
import LoginForm from './components/loginForm.jsx';// ou LoginForm, se preferir
import Dashboard from './components/DashboardCliente.jsx';
import DashboardAdmin from './components/DashboardAdmin.jsx';
import ProdutosAdmin from './components/produtosAdmin.jsx';
import RestaurantesAdmin from './components/restauranteAdmin.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/cadastro" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboardCliente" element={<Dashboard />} />
        <Route path="/dashboardAdmin" element={<DashboardAdmin />} />
        <Route path="/produtosAdmin" element={<ProdutosAdmin />} />
        <Route path="/restaurantesAdmin" element={<RestaurantesAdmin />} />

        {/* Adicione outras rotas conforme necessário */}
      </Routes>
    </Router>
  );
}

export default App;