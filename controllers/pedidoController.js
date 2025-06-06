import { criarPedido, listarPedidos, listarPedidosPorRestaurante, 
 editarItemPedido, cancelarPedido, buscarPedidoDetalhado, listarPedidosPorFiltro} from '../models/pedidoModel.js'

export async function postPedido(req, res) {
    const { usuarioId, itens } = req.body
    if (!usuarioId || !Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({ error: 'Dados do pedido inválidos.' })
    }
    try {
        const pedidoId = await criarPedido({ usuarioId, itens })
        res.status(201).json({ pedidoId })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao criar pedido.' })
    }
}

export async function getPedidos(req, res) {
        const { page = 1, limit = 10 } = req.query
    try {
        const pedidos = await listarPedidos(page, limit)
        res.status(200).json(pedidos)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao listar pedidos.' })
    }
}

export async function getPedidosPorRestaurante(req, res) {
    const { restauranteId } = req.params
    try {
        const pedidos = await listarPedidosPorRestaurante(restauranteId)
        res.status(200).json(pedidos)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao listar pedidos do restaurante.' })
    }
}

export async function putItemPedido(req, res) {
    const { itemId } = req.params
    const { novaQuantidade } = req.body
    try {
        await editarItemPedido(itemId, novaQuantidade)
        res.status(200).json({ message: 'Item atualizado com sucesso.' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao atualizar item do pedido.' })
    }
}

export async function deletePedido(req, res) {
    const { pedidoId } = req.params
    const restauranteId = req.usuario.restauranteId 

    try {
        const pedido = await buscarPedidoPorId(pedidoId)
        if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado.' })
        if (pedido.restaurante_id !== Number(restauranteId)) {
            return res.status(403).json({ error: 'Acesso negado.' })
        }
        if (pedido.status !== 'pendente') {
            return res.status(400).json({ error: 'Só é possível cancelar pedidos pendentes.' })
        }

        await cancelarPedido(pedidoId)
        res.status(200).json({ message: 'Pedido cancelado com sucesso.' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao cancelar pedido.' })
    }
}

export async function getPedidoDetalhado(req, res) {
    const { pedidoId } = req.params
    try {
        const detalhes = await buscarPedidoDetalhado(pedidoId)
        if (!detalhes.length) return res.status(404).json({ error: 'Pedido não encontrado.' })
        res.status(200).json(detalhes)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao buscar detalhes do pedido.' })
    }
}

export async function getHistoricoPedidos(req, res) {
    const { restauranteId } = req.params
    const { dataInicio, dataFim, status } = req.query
    try {
        const pedidos = await listarPedidosPorFiltro(restauranteId, dataInicio, dataFim, status)
        res.status(200).json(pedidos)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao buscar histórico de pedidos.' })
    }
}

export async function uploadComprovante(req, res) {
    const { pedidoId } = req.params
    if (!req.file) {
        return res.status(400).json({ error: 'Arquivo não enviado.' })
    }
    const caminhoComprovante = req.file.path

    try {
        await salvarComprovante(pedidoId, caminhoComprovante)
        res.status(200).json({ message: 'Comprovante enviado com sucesso.', comprovante: caminhoComprovante })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao salvar comprovante.' })
    }
}