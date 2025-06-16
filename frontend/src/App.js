import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage.jsx';
import SignUpForm from './components/SignUpForm.jsx';
import LoginForm from './components/loginForm.jsx';// ou LoginForm, se preferir
import Dashboard from './components/DashboardCliente.jsx';
import DashboardAdmin from './components/DashboardAdmin.jsx';
import ProdutosAdmin from './components/produtosAdmin.jsx';
import RestaurantesAdmin from './components/restauranteAdmin.jsx';
import DashboardUsuarios from './components/DashboardUsuarios.jsx';
import RelatorioFinanceiro from './components/DashboardRelatorio.jsx';  
import OrderSeparator from './components/DashboardSeparador.jsx';
import OrderProducts from './components/PedidoCliente.jsx';
import ConfirmOrder from './components/visualizaPedidoCliente.jsx';
import AllOrders from './components/pedidoAdmin.jsx';
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
        <Route path="/usuariosAdmin" element={<DashboardUsuarios />} />
        <Route path="/relatorioAdmin" element={<RelatorioFinanceiro />} />
        <Route path="/separador" element={<OrderSeparator />} />
        <Route path="/pedidoCliente" element={<OrderProducts />} />
        <Route path="/visualizaPedidoCliente" element={<ConfirmOrder />} />
        <Route path="/pedidoAdmin" element={<AllOrders />} />

        {/* Adicione outras rotas conforme necessário */}
      </Routes>
    </Router>
  );
}

export default App;