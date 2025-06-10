import pool from '../conections/database.js'

export async function buscarRestaurantePorNome(nome) {
    const result = await pool.query(
        'SELECT id FROM restaurantes WHERE nome = $1',
        [nome]
    )
    return result.rows[0]
}

export async function criarRestaurante({ nome, cnpj, telefone }) {
    const result = await pool.query(
        'INSERT INTO restaurantes (nome, cnpj, telefone) VALUES ($1, $2, $3) RETURNING id',
        [nome, cnpj || null, telefone || null]
    )
    return result.rows[0]
}

export async function criarUsuario({ nome, email, senha_hash, tipo, restauranteId }) {
    const result = await pool.query(
        `INSERT INTO usuarios (nome, email, senha_hash, tipo, restaurante_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, nome, email, tipo, restaurante_id`,
        [nome, email, senha_hash, tipo, restauranteId || null]
    )
    return result.rows[0]
}

export async function buscarUsuarioPorNomeETipo(nome, tipo) {
    const result = await pool.query(
        'SELECT * FROM usuarios WHERE nome = $1 AND tipo = $2',
        [nome, tipo]
    )
    return result.rows[0]
}

export async function salvarRefreshToken(usuarioId, token) {
    await pool.query(
        'INSERT INTO refresh_tokens (usuario_id, token) VALUES ($1, $2)',
        [usuarioId, token]
    )
}

// Buscar refresh token
export async function buscarRefreshToken(token) {
    const result = await pool.query(
        'SELECT * FROM refresh_tokens WHERE token = $1',
        [token]
    )
    return result.rows[0]
}

// Remover refresh token (logout ou renovação)
export async function removerRefreshToken(token) {
    await pool.query(
        'DELETE FROM refresh_tokens WHERE token = $1',
        [token]
    )
}

export async function salvarTokenReset(email, token, expires) {
    await pool.query(
        'UPDATE usuarios SET reset_token = $1, reset_token_expires = $2 WHERE email = $3',
        [token, expires, email]
    )
}

export async function buscarUsuarioPorResetToken(token) {
    const result = await pool.query(
        'SELECT * FROM usuarios WHERE reset_token = $1 AND reset_token_expires > NOW()',
        [token]
    )
    return result.rows[0]
}

export async function atualizarSenha(usuarioId, senha_hash) {
    await pool.query('UPDATE usuarios SET senha_hash = $1, reset_token = NULL WHERE id = $2', [senha_hash, usuarioId])
}



export async function atualizarPerfil(usuarioId, { nome, email }) {
    await pool.query(
        'UPDATE usuarios SET nome = $1, email = $2 WHERE id = $3',
        [nome, email, usuarioId]
    )
}

export async function buscarUsuarioPorId(usuarioId) {
    const result = await pool.query(
        'SELECT id, nome, email, tipo, restaurante_id, criado_em FROM usuarios WHERE id = $1',
        [usuarioId]
    )
    return result.rows[0]
}



export async function excluirUsuario(usuarioId) {
    await pool.query('DELETE FROM usuarios WHERE id = $1', [usuarioId])
}