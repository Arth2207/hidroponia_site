import pool from '../conections/database.js'

// Função utilitária para calcular datas a partir do período
function calcularIntervalo(periodo) {
    const hoje = new Date()
    let dataInicio, dataFim

    dataFim = hoje

    switch (periodo) {
        case 'diario':
            dataInicio = new Date(hoje)
            break
        case 'semanal':
            dataInicio = new Date(hoje)
            dataInicio.setDate(hoje.getDate() - 6)
            break
        case 'quinzenal':
            dataInicio = new Date(hoje)
            dataInicio.setDate(hoje.getDate() - 14)
            break
        case 'mensal':
        default:
            dataInicio = new Date(hoje)
            dataInicio.setDate(hoje.getDate() - 29)
            break
    }

    // Formata para yyyy-mm-dd
    const pad = n => n.toString().padStart(2, '0')
    const format = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
    return { dataInicio: format(dataInicio), dataFim: format(dataFim) }
}

// Relatório financeiro por restaurante
export async function relatorioRestaurantesPeriodo(periodo, dataInicio, dataFim) {
    // Se não vier dataInicio/dataFim, calcula pelo período
    if (!dataInicio || !dataFim) {
        const intervalo = calcularIntervalo(periodo)
        dataInicio = intervalo.dataInicio
        dataFim = intervalo.dataFim
    }
    const result = await pool.query(`
        SELECT r.nome AS restaurante, 
               SUM(ip.quantidade * COALESCE(prr.preco, p.preco)) AS total_vendas,
               COUNT(DISTINCT ped.id) AS total_pedidos
        FROM pedidos ped
        JOIN restaurantes r ON ped.restaurante_id = r.id
        JOIN itens_pedido ip ON ip.pedido_id = ped.id
        JOIN produtos p ON ip.produto_id = p.id
        LEFT JOIN precos_restaurante prr ON prr.restaurante_id = r.id AND prr.produto_id = p.id
        WHERE ped.criado_em BETWEEN $1 AND $2
        GROUP BY r.nome
        ORDER BY total_vendas DESC
    `, [dataInicio, dataFim])
    return result.rows
}

// Relatório financeiro por produto (hortaliça)
export async function relatorioProdutosPeriodo(periodo, dataInicio, dataFim) {
    if (!dataInicio || !dataFim) {
        const intervalo = calcularIntervalo(periodo)
        dataInicio = intervalo.dataInicio
        dataFim = intervalo.dataFim
    }
    const result = await pool.query(`
        SELECT p.nome AS produto, 
               SUM(ip.quantidade) AS total_quantidade,
               SUM(ip.quantidade * COALESCE(prr.preco, p.preco)) AS total_vendas
        FROM pedidos ped
        JOIN itens_pedido ip ON ip.pedido_id = ped.id
        JOIN produtos p ON ip.produto_id = p.id
        LEFT JOIN precos_restaurante prr ON prr.restaurante_id = ped.restaurante_id AND prr.produto_id = p.id
        WHERE ped.criado_em BETWEEN $1 AND $2
        GROUP BY p.nome
        ORDER BY total_vendas DESC
    `, [dataInicio, dataFim])
    return result.rows
}