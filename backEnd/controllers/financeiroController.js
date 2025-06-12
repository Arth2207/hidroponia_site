import { relatorioRestaurantesPeriodo, relatorioProdutosPeriodo } from '../models/financeiroModel.js'

export async function relatorioFinanceiroRestaurantes(req, res) {
    const { periodo = 'mensal', dataInicio, dataFim } = req.query
    try {
        const relatorio = await relatorioRestaurantesPeriodo(periodo, dataInicio, dataFim)
        res.status(200).json(relatorio)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao gerar relatório financeiro dos restaurantes.' })
    }
}

export async function relatorioFinanceiroProdutos(req, res) {
    const { periodo = 'mensal', dataInicio, dataFim } = req.query
    try {
        const relatorio = await relatorioProdutosPeriodo(periodo, dataInicio, dataFim)
        res.status(200).json(relatorio)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao gerar relatório financeiro dos produtos.' })
    }
}