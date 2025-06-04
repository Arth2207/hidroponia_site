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