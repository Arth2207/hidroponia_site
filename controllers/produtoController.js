import { listarProdutosPaginado,buscarProdutoPorId,cadastrarProduto,editarProduto,excluirProduto} from "../models/produtoModels";
import { registrarAuditoriaProduto } from "../models/auditoriaModels";
import pool from '../conections/database.js' 

let produtosCache = null
let cacheTimestamp = 0
const CACHE_TTL = 60 * 1000

export async function getProdutos(req, res) {
    try {
        const limit = parseInt(req.query.limit) || 10
        const offset = parseInt(req.query.offset) || 0
        const orderBy = req.query.orderBy || 'id'
        const orderDir = req.query.orderDir === 'desc' ? 'DESC' : 'ASC'
        const nomeBusca = req.query.nome || ''

        // Só usa cache se for a primeira página, sem busca e ordenação padrão
        const now = Date.now()
        if (
            produtosCache &&
            (now - cacheTimestamp < CACHE_TTL) &&
            limit === 10 && offset === 0 &&
            !nomeBusca && orderBy === 'id' && orderDir === 'ASC'
        ) {
            return res.status(200).json(produtosCache)
        }

        // Busca e ordenação dinâmica
        const produtos = await listarProdutosPaginado(limit, offset, orderBy, orderDir, nomeBusca)
        const { count } = await pool.query(
            'SELECT COUNT(*) FROM produtos WHERE ativo = true AND nome ILIKE $1',
            [`%${nomeBusca}%`]
        ).then(r => r.rows[0])
        const response = { produtos, total: parseInt(count) }

        // Só armazena cache para a primeira página, sem busca e ordenação padrão
        if (limit === 10 && offset === 0 && !nomeBusca && orderBy === 'id' && orderDir === 'ASC') {
            produtosCache = response
            cacheTimestamp = now
        }

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

// Limpe o cache sempre que cadastrar, editar ou excluir produto:
export async function cadastrarProdutoController(req, res) {
    try {
        const { nome, unidade, preco } = req.body
        const produto = await cadastrarProduto({ nome, unidade, preco })
        await registrarAuditoriaProduto(req.usuario.id, 'Produto cadastrado', produto.id)
        // Limpa cache
        produtosCache = null
        cacheTimestamp = 0
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
        // Limpa cache
        produtosCache = null
        cacheTimestamp = 0
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
        // Limpa cache
        produtosCache = null
        cacheTimestamp = 0
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
        res.status(200).json({ message: 'Produto restaurado com sucesso.', produto })
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') console.error(error)
        res.status(500).json({ error: 'Erro ao restaurar produto.' })
    }
}