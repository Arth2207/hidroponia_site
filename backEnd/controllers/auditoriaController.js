import { listarAuditoria } from '../models/auditoriaModel.js'

export async function getLogsSistema(req, res) {
    const { usuarioId, acao, dataInicio, dataFim, limit, offset } = req.query
    try {
        const logs = await listarAuditoria({ usuarioId, acao, dataInicio, dataFim, limit, offset })
        res.status(200).json(logs)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao buscar logs do sistema.' })
    }
}