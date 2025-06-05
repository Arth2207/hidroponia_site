import pool from '../conections/database.js'

export async function criarPedido({ usarioId, itens }) {
	const pedidoResult = await pool.query (
        'INSERT INTO pedidos (usuario_id, criado_em) VALUES ($1, NOW(   )) RETURNING id',
        [usarioId]
    )
    const pedidoId = pedidoResult.rows[0].id

    for (const item of itens) {
        await pool.query(
            'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade) VALUES ($1, $2, $3)',
            [pedidoId, item.produtoId, item.quantidade]
        )
    }


    const totalResult = await pool.query(
       `SELECT SUM(p.preco * pi.quantidade) AS total 
        FROM itens_pedido pi 
        JOIN produtos p ON pi.produto_id = p.id 
        WHERE pi.pedido_id = $1`,
        [pedidoId]
    )
    const total = totalResult.rows[0].total

    return {pedidoId, total}
}

export async function listarPedidos(page, limit){
    const offset = (page - 1) * limit
    const result = await pool.query(
       `SELECT p.id as pedido_id, p.criado_em, u.nome AS cliente, 
             SUM(pi.quantidade * pr.preco) AS total
        FROM pedidos p
        JOIN usuarios u ON p.usuario_id = u.id
        JOIN itens_pedido pi ON p.pedido_id = pi.id
        JOIN produtos pr ON pr.id = pi.pedido_id
        GROUP BY p.id, u.nome, p.criado_em
        ORDER BY p.criado_em DESC
        LIMIT $1 OFFSET $2`,
        [limit, offset]
    )
    return result.rows;
}



export async function listarPedidosPorRestaurante(restauranteId) {
    const result = await pool.query(
        `SELECT p.id AS pedido_id, p.criado_em, u.nome AS cliente, 
                SUM(pi.quantidade * pr.preco) AS total
         FROM pedidos p
         JOIN usuarios u ON p.restaurante_id = u.restaurante_id
         JOIN itens_pedido ip ON ip.pedido_id = p.id
         JOIN produtos pr ON pr.id = pi.produto_id
         WHERE u.restaurante_id = $1
         GROUP BY p.id, u.nome, p.criado_em
         ORDER BY p.criado_em DESC`,
        [restauranteId]
    )
    return result.rows;
}

export async function editarItemPedido(itemId, novaQuantidade) {
    await pool.query(
        'UPDATE itens_pedido SET quantidade = $1 WHERE id = $2',
        [novaQuantidade, itemId]
    )
}

export async function cancelarPedido(pedidoId) {
    await pool.query('DELETE FROM pedidos WHERE id = $1', [pedidoId])
}

export async function buscarPedidoDetalhado(pedidoId) {
    const result = await pool.query(
        `SELECT p.id as pedido_id, p.criado_em, p.status, u.nome as cliente, 
                ip.produto_id, pr.nome as produto, ip.quantidade, pr.preco
         FROM pedidos p
         JOIN usuarios u ON p.restaurante_id = u.restaurante_id
         JOIN itens_pedido ip ON ip.pedido_id = p.id
         JOIN produtos pr ON pr.id = ip.produto_id
         WHERE p.id = $1`,
        [pedidoId]
    )
    return result.rows
}

export async function listarPedidosPorFiltro(restauranteId, dataInicio, dataFim, status) {
    let query = `SELECT p.id as pedido_id, p.criado_em, p.status, SUM(ip.quantidade * pr.preco) as total
                 FROM pedidos p
                 JOIN itens_pedido ip ON ip.pedido_id = p.id
                 JOIN produtos pr ON pr.id = ip.produto_id
                 WHERE p.restaurante_id = $1`
    const params = [restauranteId]
    if (dataInicio) {
        query += ' AND p.criado_em >= $2'
        params.push(dataInicio)
    }
    if (dataFim) {
        query += ' AND p.criado_em <= $3'
        params.push(dataFim)
    }
    if (status) {
        query += ' AND p.status = $4'
        params.push(status)
    }
    query += ' GROUP BY p.id, p.criado_em, p.status ORDER BY p.criado_em DESC'
    const result = await pool.query(query, params)
    return result.rows
}

export async function salvarComprovante(pedidoId, caminhoComprovante) {
    await pool.query(
        'UPDATE pedidos SET comprovante = $1 WHERE id = $2',
        [caminhoComprovante, pedidoId]
    )
}