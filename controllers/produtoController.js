import { listarProdutos,} from "../models/produtoModels";




export async function getProdutos(req, res) {
    try {
        const produtos = await listarProdutos();
        res.status(200).json(produtos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar produtos.' });
    }
}