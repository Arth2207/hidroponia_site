import express from 'express'
import { relatorioFinanceiroRestaurantes, relatorioFinanceiroProdutos,} from '../controllers/financeiroController.js'
import { autenticarJWT, permitirPerfis } from '../middlewares/auth.js'
import { getLogsSistema } from '../controllers/auditoriaController.js'
import { 
    alterarPrecoProdutoController, 
    alterarPrecoPersonalizadoController, 
    historicoAlteracoesPrecoController, getRankingMaisVendidos
} from '../controllers/produtoController.js'
import { getHistoricoPedidos } from '../controllers/pedidoController.js'

const router = express.Router()

// Relatório financeiro por restaurante (apenas admin)
router.get('/admin/financeiro/restaurantes',autenticarJWT,permitirPerfis('admin'),relatorioFinanceiroRestaurantes)

// Relatório financeiro por produto (apenas admin)
router.get('/admin/financeiro/produtos',autenticarJWT, permitirPerfis('admin'),relatorioFinanceiroProdutos)
router.get('/admin/logs', autenticarJWT, permitirPerfis('admin'), getLogsSistema)
router.get('/admin/produtos/:produtoId/historico-preco', autenticarJWT, permitirPerfis('admin'), historicoAlteracoesPrecoController)
router.put('/admin/produtos/:produtoId/preco/restaurante/:restauranteId', autenticarJWT, permitirPerfis('admin'), alterarPrecoPersonalizadoController)
router.put('/admin/produtos/:produtoId/preco', autenticarJWT, permitirPerfis('admin'), alterarPrecoProdutoController)
router.get('/admin/pedidos/restaurante/:restauranteId',autenticarJWT,permitirPerfis('admin'),getHistoricoPedidos)
router.get('/admin/produtos/mais-vendidos', autenticarJWT, permitirPerfis('admin'), getRankingMaisVendidos)

export default router