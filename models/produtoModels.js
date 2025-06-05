import pool from '.../conections/database.js'


export async function listarProdutos() {
    const result = await pool.query('SELECT * FROM produtos WHERE ativo = true');
    return result.rows;
};