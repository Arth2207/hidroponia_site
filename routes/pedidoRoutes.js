import express from 'express';
import { getPedido, postPedido, getPedidosPorRestaurante, 
    putItemPedido, deletePedido, getPedidoDetalhado, getHistoricoPedidos } from '../controllers/pedidoController.js';
import { autenticarJWT } from '../middlewares/auth.js'
import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        cb(null, `comprovante_${Date.now()}${ext}`)
    }
})


const router = express.Router();
const upload = multer({ storage })


router.post('/pedido', autenticarJWT, postPedido);
router.get('/pedidos', autenticarJWT, getPedido);
router.get('/pedidos/restaurante/:restauranteId', autenticarJWT, getPedidosPorRestaurante)
router.put('/pedido/item/:itemId', autenticarJWT, putItemPedido)
router.delete('/pedido/:pedidoId', autenticarJWT, deletePedido)
router.get('/pedido/:pedidoId', autenticarJWT, getPedidoDetalhado)
router.get('/pedidos/historico/:restauranteId', autenticarJWT, getHistoricoPedidos)
router.post('/pedido/:pedidoId/comprovante', autenticarJWT, upload.single('comprovante'), uploadComprovante)

export default router;