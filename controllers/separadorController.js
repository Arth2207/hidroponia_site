import { listarPedidosParaSeparadorDB, buscarPedidoDetalhado, marcarPedidoSeparadoDB } from '../models/pedidoModels.js'

// Lista pedidos atribuídos ao separador logado
export async function listarPedidosParaSeparador(req, res) {
    const separadorId = req.usuario.id
    const pedidos = await listarPedidosParaSeparadorDB(separadorId)
    res.status(200).json(pedidos)
}

// Detalha um pedido específico
export async function getPedidoDetalhadoSeparador(req, res) {
    const { pedidoId } = req.params
    const pedido = await buscarPedidoDetalhado(pedidoId)
    res.status(200).json(pedido)
}

// Marca pedido como separado
export async function marcarPedidoComoSeparado(req, res) {
    const { pedidoId } = req.params
    await marcarPedidoSeparadoDB(pedidoId)
    res.status(200).json({ message: 'Pedido marcado como separado.' })
}

export async function getPedidosPorSeparador(req, res) {
    const separadorId = req.usuario.id
    try {
        const pedidos = await listarPedidosPorSeparador(separadorId)
        res.status(200).json(pedidos)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao listar pedidos do separador.' })
    }
}