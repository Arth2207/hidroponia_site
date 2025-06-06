import pool from '.../conections/database.js'


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