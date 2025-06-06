import { criarAviso, listarAvisos, desativarAviso } from '../models/avisoModel.js'

export async function postAviso(req, res) {
    const { mensagem } = req.body
    if (!mensagem) return res.status(400).json({ error: 'Mensagem obrigatória.' })
    try {
        await criarAviso(mensagem)
        res.status(201).json({ message: 'Aviso criado.' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao criar aviso.' })
    }
}

export async function getAvisos(req, res) {
    try {
        const avisos = await listarAvisos()
        res.status(200).json(avisos)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao buscar avisos.' })
    }
}

export async function deleteAviso(req, res) {
    const { id } = req.params
    try {
        await desativarAviso(id)
        res.status(200).json({ message: 'Aviso removido.' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao remover aviso.' })
    }
}