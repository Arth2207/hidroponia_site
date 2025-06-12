import pool from '../conections/database.js'


export async function registrarAuditoriaProduto(usuarioId, acao, produtoId, detalhes = null) {
    await pool.query(
        'INSERT INTO auditoria_produtos (usuario_id, acao, produto_id, detalhes) VALUES ($1, $2, $3, $4)',
        [usuarioId, acao, produtoId, detalhes]
    )
}

export async function listarAuditoriaPorUsuario(usuarioId) {
    const result = await pool.query(
        'SELECT acao, data FROM auditoria WHERE usuario_id = $1 ORDER BY data DESC',
        [usuarioId]
    )
    return result.rows
}

export async function registrarAuditoria(usuarioId, acao) {
    await pool.query(
        'INSERT INTO auditoria (usuario_id, acao) VALUES ($1, $2)',
        [usuarioId, acao]
    )
}

export async function listarAuditoria({ usuarioId, acao, dataInicio, dataFim, limit = 50, offset = 0 }) {
    let query = 'SELECT a.id, a.usuario_id, u.nome, a.acao, a.data FROM auditoria a LEFT JOIN usuarios u ON a.usuario_id = u.id WHERE 1=1'
    const params = []

    if (usuarioId) {
        params.push(usuarioId)
        query += ` AND a.usuario_id = $${params.length}`
    }
    if (acao) {
        params.push(`%${acao}%`)
        query += ` AND a.acao ILIKE $${params.length}`
    }
    if (dataInicio && dataFim) {
        params.push(dataInicio, dataFim)
        query += ` AND a.data BETWEEN $${params.length - 1} AND $${params.length}`
    }
    query += ` ORDER BY a.data DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    const result = await pool.query(query, params)
    return result.rows
}