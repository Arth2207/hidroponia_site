import pool from '../conections/database.js'

export async function criarPedido({ usuarioId, itens }) {
	let pedidoResult;
    if (separadorId) {
        // Se separadorId foi informado, inclui na query
        pedidoResult = await pool.query(
            'INSERT INTO pedidos (usuario_id, criado_em, separador_id) VALUES ($1, NOW(), $2) RETURNING id',
            [usuarioId, separadorId]
        )
    } else {
        // Se não, cria sem o separador
        pedidoResult = await pool.query(
            'INSERT INTO pedidos (usuario_id, criado_em) VALUES ($1, NOW()) RETURNING id',
            [usuarioId]
        )
    }
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

export async function listarResumoPedidos(dataInicio, dataFim, page = 1, limit = 20, status, restauranteId) {
    const offset = (page - 1) * limit
    let query = `
        SELECT 
            p.id AS produto_id,
            p.nome AS produto_nome,
            p.unidade,
            SUM(ip.quantidade) AS total_quantidade,
            SUM(ip.quantidade * p.preco) AS total_valor
        FROM itens_pedido ip
        JOIN produtos p ON ip.produto_id = p.id
        JOIN pedidos ped ON ip.pedido_id = ped.id
        WHERE 1=1
    `
    const params = []
    if (dataInicio && dataFim) {
        params.push(dataInicio, dataFim)
        query += ` AND ped.criado_em BETWEEN $${params.length} AND $${params.length + 1}`
    }
    if (status) {
        params.push(status)
        query += ` AND ped.status = $${params.length}`
    }
    if (restauranteId) {
        params.push(restauranteId)
        query += ` AND ped.restaurante_id = $${params.length}`
    }
    query += `
        GROUP BY p.id, p.nome, p.unidade
        ORDER BY p.nome
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `
    params.push(limit, offset)
    const result = await pool.query(query, params)
    return result.rows
}

export async function editarObservacaoItemPedido(itemId, observacao) {
    await pool.query(
        'UPDATE itens_pedido SET observacoes = $1 WHERE id = $2',
        [observacao, itemId]
    )
}

export async function buscarObservacaoItemPedido(itemId) {
    const result = await pool.query(
        'SELECT observacoes FROM itens_pedido WHERE id = $1',
        [itemId]
    )
    return result.rows[0]?.observacoes || ''
}

export async function listarRestaurantesSemPedido(dataEntrega) {
    const result = await pool.query(
        `SELECT r.id, r.nome
         FROM restaurantes r
         WHERE NOT EXISTS (
             SELECT 1 FROM pedidos p
             WHERE p.restaurante_id = r.id
               AND p.data_entrega = $1
               AND p.status != 'cancelado'
         )
         ORDER BY r.nome`,
        [dataEntrega]
    )
    return result.rows
}

import pool from '../conections/database.js'

export async function matrizPedidosPorDia(dataEntrega) {
    // Busca todos os produtos (hortaliças)
    const produtosResult = await pool.query('SELECT nome FROM produtos ORDER BY nome')
    const produtos = produtosResult.rows.map(r => r.nome)

    // Busca todos os restaurantes que fizeram pedido no dia
    const restaurantesResult = await pool.query(
        `SELECT DISTINCT r.nome
         FROM pedidos p
         JOIN restaurantes r ON p.restaurante_id = r.id
         WHERE p.data_entrega = $1 AND p.status != 'cancelado'
         ORDER BY r.nome`,
        [dataEntrega]
    )
    const restaurantes = restaurantesResult.rows.map(r => r.nome)

    // Busca as quantidades pedidas por produto/restaurante
    const pedidosResult = await pool.query(
        `SELECT r.nome AS restaurante, p.nome AS produto, SUM(ip.quantidade) AS quantidade
         FROM pedidos ped
         JOIN restaurantes r ON ped.restaurante_id = r.id
         JOIN itens_pedido ip ON ip.pedido_id = ped.id
         JOIN produtos p ON ip.produto_id = p.id
         WHERE ped.data_entrega = $1 AND ped.status != 'cancelado'
         GROUP BY r.nome, p.nome`,
        [dataEntrega]
    )
    const pedidos = pedidosResult.rows

    return { produtos, restaurantes, pedidos }
}

export async function salvarObservacaoPedido(pedidoId, observacao) {
    await pool.query('UPDATE pedidos SET observacao = $1 WHERE id = $2', [observacao, pedidoId])
}

export async function buscarObservacaoPedido(pedidoId) {
    const result = await pool.query('SELECT observacao FROM pedidos WHERE id = $1', [pedidoId])
    return result.rows[0]?.observacao || ''
}

export async function listarPedidosParaSeparadorDB(separadorId) {
    const result = await pool.query(
        `SELECT * FROM pedidos WHERE separador_id = $1`, // Remova o filtro status se quiser mostrar todos
        [separadorId]
    )
    return result.rows
}

export async function marcarPedidoSeparadoDB(pedidoId) {
    await db.query('UPDATE pedidos SET status = $1 WHERE id = $2', ['separado', pedidoId])
}

export async function usuarioPodeEditarObservacaoItem(itemId, usuarioId) {
    const result = await pool.query(
        `SELECT p.usuario_id
         FROM itens_pedido ip
         JOIN pedidos p ON ip.pedido_id = p.id
         WHERE ip.id = $1`, [itemId]
    )
    return result.rows.length > 0 && result.rows[0].usuario_id === usuarioId
}

