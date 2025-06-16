import express from 'express'
import { autenticarJWT, permitirPerfis } from '../middlewares/auth.js'
import { listarPedidosParaSeparador, getPedidoDetalhadoSeparador, marcarPedidoComoSeparado } from '../controllers/separadorController.js'

const router = express.Router()

// Lista todos os pedidos que o separador deve separar
router.get('/separador/pedidos', autenticarJWT, permitirPerfis('funcionario'), listarPedidosParaSeparador)

// Detalha um pedido específico para o separador
router.get('/separador/pedido/:pedidoId', autenticarJWT, permitirPerfis('funcionario'), getPedidoDetalhadoSeparador)

// Marca pedido como separado
router.post('/separador/pedido/:pedidoId/separar', autenticarJWT, permitirPerfis('funcionario'), marcarPedidoComoSeparado)

export default router