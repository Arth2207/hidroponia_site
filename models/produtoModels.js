import pool from '.../conections/database.js'


export async function listarProdutosPaginado(limit, offset, orderBy, orderDir, nomeBusca) {
    const camposPermitidos = ['id', 'nome', 'preco']
    const campo = camposPermitidos.includes(orderBy) ? orderBy : 'id'
    const direcao = orderDir === 'DESC' ? 'DESC' : 'ASC'
    const result = await pool.query(
        `SELECT * FROM produtos WHERE ativo = true AND nome ILIKE $1 ORDER BY ${campo} ${direcao} LIMIT $2 OFFSET $3`,
        [`%${nomeBusca}%`, limit, offset]
    )
    return result.rows
}

export async function buscarProdutoPorId(id) {
    const result = await pool.query('SELECT * FROM produtos WHERE id = $1', [id]);
    return result.rows[0];
}

export async function cadastrarProduto({ nome, unidade, preco}){
    const result = await pool.query(
        'INSERT INTO produtos (nome, unidade, preco) VALUES ($1, $2, $3) RETURNING *',
        [nome, unidade, preco]
    );
    return result.rows[0];
}

export async function editarProduto(id, { nome, unidade, preco }) {
    const result = await pool.query(
        'UPDATE produtos SET nome = $1, unidade = $2, preco = $3 WHERE id = $4 RETURNING *',
        [nome, unidade, preco, id]
    );
    return result.rows[0];
}

export async function excluirProduto(id) {
    const result = await pool.query(
        'UPDATE produtos SET ativo = false WHERE id = $1 RETURNING *',
        [id]
    );
    return result.rows[0];
}

export async function restaurarProduto(id) {
    const result = await pool.query(
        'UPDATE produtos SET ativo = true WHERE id = $1 RETURNING *',
        [id]
    )
    return result.rows[0]
}

export async function buscarPrecoRestaurante(restauranteId, produtoId) {
    const result = await pool.query(
        'SELECT preco FROM precos_restaurante WHERE restaurante_id = $1 AND produto_id = $2',
        [restauranteId, produtoId]
    )
    return result.rows[0]?.preco || null
}

// Atualiza ou insere o preço de um produto para um restaurante
export async function salvarOuAtualizarPreco(restauranteId, produtoId, preco) {
    await pool.query(
        `INSERT INTO precos_restaurante (restaurante_id, produto_id, preco)
         VALUES ($1, $2, $3)
         ON CONFLICT (restaurante_id, produto_id)
         DO UPDATE SET preco = EXCLUDED.preco`,
        [restauranteId, produtoId, preco]
    )
}

export async function listarHistoricoPrecoProduto(produtoId) {
    const result = await pool.query(
        `SELECT usuario_id, acao, detalhes, data 
         FROM auditoria_produtos 
         WHERE produto_id = $1 AND acao ILIKE '%preço%' 
         ORDER BY data DESC`,
        [produtoId]
    )
    return result.rows
}

export async function rankingMaisVendidos(periodo = 'mensal') {
    // Calcular datas conforme o período
    const hoje = new Date()
    let dataInicio = new Date(hoje)
    if (periodo === 'semanal') dataInicio.setDate(hoje.getDate() - 6)
    else dataInicio.setDate(hoje.getDate() - 29)
    const pad = n => n.toString().padStart(2, '0')
    const format = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

    const result = await pool.query(
        `SELECT p.nome, SUM(ip.quantidade) AS total_vendido
         FROM itens_pedido ip
         JOIN produtos p ON ip.produto_id = p.id
         JOIN pedidos ped ON ip.pedido_id = ped.id
         WHERE ped.criado_em BETWEEN $1 AND $2
         GROUP BY p.nome
         ORDER BY total_vendido DESC
         LIMIT 10`,
        [format(dataInicio), format(hoje)]
    )
    return result.rows
}