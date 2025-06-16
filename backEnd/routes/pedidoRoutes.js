import express from 'express';
// Importa todos os controladores relacionados a pedidos
import { 
    getPedidos,                      // Lista todos os pedidos (geral)
    postPedido,                     // Cria um novo pedido
    getPedidosPorRestaurante,       // Lista pedidos de um restaurante específico
    putItemPedido,                  // Edita um item do pedido
    deletePedido,                   // Remove/cancela um pedido
    getPedidoDetalhado,             // Busca detalhes de um pedido específico
    getHistoricoPedidos,            // Lista histórico de pedidos de um restaurante
    uploadComprovante,              // Faz upload do comprovante do pedido
    putObservacaoItemPedido,        // Edita observação de um item do pedido
    getObservacaoItemPedido,        // Busca observação de um item do pedido
    putObservacaoPedido,            // Edita observação/feedback do pedido
    getObservacaoPedido,
    getUltimoPedidoRestaurante             // Busca observação/feedback do pedido
} from '../controllers/pedidoController.js';

import { autenticarJWT } from '../middlewares/auth.js' // Middleware de autenticação JWT
import multer from 'multer'                             // Middleware para upload de arquivos
import path from 'path'

// Configuração do armazenamento de arquivos para comprovantes
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads/') // Pasta onde os arquivos serão salvos
    },
    filename: (_, file, cb) => {
        const ext = path.extname(file.originalname)
        cb(null, `comprovante_${Date.now()}${ext}`) // Nomeia o arquivo com timestamp
    }
})

const router = express.Router();
const upload = multer({ storage })

// Rota para criar um novo pedido
router.post('/pedido', autenticarJWT, postPedido);

// Rota para listar todos os pedidos
router.get('/pedidos', autenticarJWT, getPedidos);

// Rota para listar pedidos de um restaurante específico
router.get('/pedidos/restaurante/:restauranteId', autenticarJWT, getPedidosPorRestaurante)

// Rota para editar um item do pedido
router.put('/pedido/item/:itemId', autenticarJWT, putItemPedido)


router.get('/pedido/ultimo', autenticarJWT, getUltimoPedidoRestaurante);

// Rota para remover/cancelar um pedido
router.delete('/pedido/:pedidoId', autenticarJWT, deletePedido)

// Rota para buscar detalhes de um pedido específico
router.get('/pedido/:pedidoId', autenticarJWT, getPedidoDetalhado)

// Rota para listar histórico de pedidos de um restaurante
router.get('/pedidos/historico/:restauranteId', autenticarJWT, getHistoricoPedidos)

// Rota para upload de comprovante do pedido
router.post('/pedido/:pedidoId/comprovante', autenticarJWT, upload.single('comprovante'), uploadComprovante)

// Rota para editar observação de um item do pedido
router.put('/pedido/item/:itemId/observacao', autenticarJWT, putObservacaoItemPedido)

// Rota para buscar observação de um item do pedido
router.get('/pedido/item/:itemId/observacao', autenticarJWT, getObservacaoItemPedido)

// Rota para editar observação/feedback do pedido
router.put('/pedido/:pedidoId/observacao', autenticarJWT, putObservacaoPedido)

// Rota para buscar observação/feedback do pedido
router.get('/pedido/:pedidoId/observacao', autenticarJWT, getObservacaoPedido)


export default router;