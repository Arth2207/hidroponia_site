// Importa middleware para permitir acesso apenas a perfis específicos
import { permitirPerfis } from '../middlewares/auth.js'

// Importa os controladores das rotas de pedidos e funcionalidades relacionadas
import { 
    getPedidosPorRestaurante,      // Lista pedidos de um restaurante específico
    putItemPedido,                 // Edita um item do pedido
    deletePedido,                  // Remove/cancela um pedido
    getHistoricoPedidos,           // Lista histórico de pedidos de um restaurante
    getPedidoDetalhado,            // Busca detalhes de um pedido específico
    getResumoPedidos,              // Mostra resumo geral dos pedidos
    putObservacaoItemPedido,       // Edita observação de um item do pedido
    getObservacaoItemPedido,       // Busca observação de um item do pedido
    getRestaurantesSemPedido,      // Lista restaurantes que não fizeram pedido no dia
    exportarPedidosParaPlanilha,   // Exporta pedidos para Excel
    putObservacaoPedido,           // Edita observação/feedback do pedido
    getObservacaoPedido            // Busca observação/feedback do pedido
} from '../controllers/pedidoController.js'

// Importa middleware de autenticação JWT
import { autenticarJWT } from '../middlewares/auth.js'

// Importa o Express e cria um router
import express from 'express'
const router = express.Router()

// Rotas protegidas para admin/funcionário gerenciarem pedidos e relatórios

// Lista pedidos de um restaurante
router.get('/pedidos/restaurante/:restauranteId', autenticarJWT, permitirPerfis('admin', 'funcionario'), getPedidosPorRestaurante)

// Busca detalhes de um pedido específico
router.get('/pedido/:pedidoId', autenticarJWT, permitirPerfis('admin', 'funcionario'), getPedidoDetalhado)

// Edita um item do pedido
router.put('/pedido/item/:itemId', autenticarJWT, permitirPerfis('admin', 'funcionario'), putItemPedido)

// Remove/cancela um pedido
router.delete('/pedido/:pedidoId', autenticarJWT, permitirPerfis('admin', 'funcionario'), deletePedido)

// Lista histórico de pedidos de um restaurante
router.get('/pedidos/historico/:restauranteId', autenticarJWT, permitirPerfis('admin', 'funcionario'), getHistoricoPedidos)

// Mostra resumo geral dos pedidos
router.get('/pedidos/resumo', autenticarJWT, permitirPerfis('admin', 'funcionario'), getResumoPedidos)

// Edita observação de um item do pedido
router.put('/pedido/item/:itemId/observacao', autenticarJWT, permitirPerfis('admin', 'funcionario'), putObservacaoItemPedido)

// Busca observação de um item do pedido
router.get('/pedido/item/:itemId/observacao', autenticarJWT, permitirPerfis('admin', 'funcionario'), getObservacaoItemPedido)

// Lista restaurantes que não fizeram pedido no dia
router.get('/restaurantes/sem-pedido', autenticarJWT, permitirPerfis('admin', 'funcionario'), getRestaurantesSemPedido)

// Exporta pedidos para Excel
router.get('/pedidos/exportar', autenticarJWT, permitirPerfis('admin', 'funcionario'), exportarPedidosParaPlanilha)

// Edita um item do pedido (rota duplicada, pode ser removida se não for necessária)
router.put('/pedido/item/:itemId', autenticarJWT, permitirPerfis('admin', 'funcionario'), putItemPedido)

// Busca observação/feedback do pedido
router.get('/pedido/:pedidoId/observacao', autenticarJWT, permitirPerfis('admin', 'funcionario'), getObservacaoPedido)

// Exporta o router para ser usado na aplicação principal
export default router