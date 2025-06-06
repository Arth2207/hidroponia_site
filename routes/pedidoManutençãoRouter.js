import { permitirPerfis } from '../middlewares/auth.js'
import { getPedidosPorRestaurante, putItemPedido, deletePedido, 
    getHistoricoPedidos, getPedidoDetalhado, getResumoPedidos,
    putObservacaoItemPedido, getObservacaoItemPedido, getRestaurantesSemPedido, exportarPedidosParaPlanilha, putObservacaoPedido, getObservacaoPedido } from '../controllers/pedidoController.js';
import { autenticarJWT } from '../middlewares/auth.js'
import express from 'express';

const router = express.Router();


router.get('/pedidos/restaurante/:restauranteId', autenticarJWT, permitirPerfis('admin', 'funcionario'), getPedidosPorRestaurante)
router.get('/pedido/:pedidoId', autenticarJWT, permitirPerfis('admin', 'funcionario'), getPedidoDetalhado)
router.put('/pedido/item/:itemId', autenticarJWT, permitirPerfis('admin', 'funcionario'), putItemPedido)
router.delete('/pedido/:pedidoId', autenticarJWT, permitirPerfis('admin', 'funcionario'), deletePedido)
router.get('/pedidos/historico/:restauranteId', autenticarJWT, permitirPerfis('admin', 'funcionario'), getHistoricoPedidos)
router.get('/pedidos/resumo',autenticarJWT,permitirPerfis('admin', 'funcionario'),getResumoPedidos)
router.put('/pedido/item/:itemId/observacao', autenticarJWT, permitirPerfis('admin', 'funcionario'), putObservacaoItemPedido)
router.get('/pedido/item/:itemId/observacao', autenticarJWT, permitirPerfis('admin', 'funcionario'), getObservacaoItemPedido)
router.get('/restaurantes/sem-pedido',autenticarJWT,permitirPerfis('admin', 'funcionario'),getRestaurantesSemPedido)
router.get('/pedidos/exportar',autenticarJWT,permitirPerfis('admin', 'funcionario'),exportarPedidosParaPlanilha)
router.put('/pedido/item/:itemId', autenticarJWT, permitirPerfis('admin', 'funcionario'), putItemPedido)
router.get('/pedido/:pedidoId/observacao', autenticarJWT, permitirPerfis('admin', 'funcionario'), getObservacaoPedido)

export default router;