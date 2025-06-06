import pool from '../conections/database.js'

export async function criarAviso(mensagem) {
    await pool.query('INSERT INTO avisos (mensagem) VALUES ($1)', [mensagem])
}

export async function listarAvisos() {
    const result = await pool.query('SELECT * FROM avisos WHERE ativo = TRUE ORDER BY data_criacao DESC')
    return result.rows
}

export async function desativarAviso(id) {
    await pool.query('UPDATE avisos SET ativo = FALSE WHERE id = $1', [id])
}