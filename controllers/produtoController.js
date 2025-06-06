import { listarProdutosPaginado,buscarProdutoPorId,cadastrarProduto,editarProduto,excluirProduto} from "../models/produtoModels";
import { registrarAuditoriaProduto } from "../models/auditoriaModels";
import pool from '../conections/database.js' 
import { redisClient } from '../middlewares/cacheRedis.js'

async function limparCacheProdutos() {
    const keys = await redisClient.keys('produtos*')
    if (keys.length > 0) {
        await redisClient.del(keys)
    }
}


export async function getProdutos(req, res) {
    try {
        const limit = parseInt(req.query.limit) || 10
        const offset = parseInt(req.query.offset) || 0
        const orderBy = req.query.orderBy || 'id'
        const orderDir = req.query.orderDir === 'desc' ? 'DESC' : 'ASC'
        const nomeBusca = req.query.nome || ''
        const cacheKey = `produtos:${limit}:${offset}:${orderBy}:${orderDir}:${nomeBusca}`

        // Busca no Redis
        const cached = await redisClient.get(cacheKey)
        if (cached) {
            return res.status(200).json(JSON.parse(cached))
        }

        // Busca e ordenação dinâmica
        const produtos = await listarProdutosPaginado(limit, offset, orderBy, orderDir, nomeBusca)
        const { count } = await pool.query(
            'SELECT COUNT(*) FROM produtos WHERE ativo = true AND nome ILIKE $1',
            [`%${nomeBusca}%`]
        ).then(r => r.rows[0])
        const response = { produtos, total: parseInt(count) }

        // Salva no Redis por 60 segundos
        await redisClient.setEx(cacheKey, 60, JSON.stringify(response))

        res.status(200).json(response)
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') console.error(error)
        res.status(500).json({ error: 'Erro ao listar produtos.' })
    }
}

export async function buscarProdutoController(req, res) {
    const { id } = req.params
    try {
        const produto = await buscarProdutoPorId(id)
        if (!produto) return res.status(404).json({ error: 'Produto não encontrado.' })
        res.status(200).json(produto)
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') console.error(error)
        res.status(500).json({ error: 'Erro ao buscar produto.' })
    }
}

export async function cadastrarProdutoController(req, res) {
    try {
        const { nome, unidade, preco } = req.body
        const produto = await cadastrarProduto({ nome, unidade, preco })
        await registrarAuditoriaProduto(req.usuario.id, 'Produto cadastrado', produto.id)
        await limparCacheProdutos()
        res.status(201).json({
            message: 'Produto cadastrado com sucesso.',
            produto
        })
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') console.error(error)
        res.status(500).json({ error: 'Erro ao cadastrar produto.' })
    }
}

export async function editarProdutoController(req, res) {
    const { id } = req.params
    try {
        const { nome, unidade, preco } = req.body
        const produto = await editarProduto(id, { nome, unidade, preco })
        if (!produto) return res.status(404).json({ error: 'Produto não encontrado.' })
        await registrarAuditoriaProduto(req.usuario.id, 'Produto editado', produto.id)
        await limparCacheProdutos()
        res.status(200).json({
            message: 'Produto editado com sucesso.',
            produto
        })
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') console.error(error)
        res.status(500).json({ error: 'Erro ao editar produto.' })
    }
}

export async function excluirProdutoController(req, res) {
    const { id } = req.params
    try {
        const produto = await excluirProduto(id)
        if (!produto) return res.status(404).json({ error: 'Produto não encontrado.' })
        await registrarAuditoriaProduto(req.usuario.id, 'Produto excluído', produto.id)
        await limparCacheProdutos()
        res.status(200).json({ message: 'Produto excluído com sucesso.' })
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') console.error(error)
        res.status(500).json({ error: 'Erro ao excluir produto.' })
    }
}

export async function restaurarProdutoController(req, res) {
    const { id } = req.params
    try {
        const produto = await restaurarProduto(id)
        if (!produto) return res.status(404).json({ error: 'Produto não encontrado.' })
        await registrarAuditoriaProduto(req.usuario.id, 'Produto restaurado', produto.id)
        await limparCacheProdutos()
        res.status(200).json({ message: 'Produto restaurado com sucesso.', produto })
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') console.error(error)
        res.status(500).json({ error: 'Erro ao restaurar produto.' })
    }
}