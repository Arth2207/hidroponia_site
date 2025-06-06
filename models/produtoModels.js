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
