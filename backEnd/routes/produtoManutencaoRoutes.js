import express from 'express';
import {getProdutos, buscarProdutoController, cadastrarProdutoController, 
    editarProdutoController, excluirProdutoController, restaurarProdutoController, listarProdutosComPrecoPersonalizado} from '../controllers/produtoController.js';
import { autenticarJWT, permitirPerfis, } from '../middlewares/auth.js'
import { validarBody, produtoSchema } from '../middlewares/validacaoJoi.js'

const router = express.Router()

// Lista todos os produtos (admin/funcionário)
router.get('/produtos', autenticarJWT, getProdutos)

// Busca um produto específico pelo ID (admin/funcionário)
router.get('/produtos/:id', autenticarJWT, buscarProdutoController)

// Cadastra um novo produto (admin/funcionário)
router.post('/produtos', autenticarJWT, permitirPerfis('admin', 'funcionario'),validarBody(produtoSchema), cadastrarProdutoController)

// Edita um produto existente (admin/funcionário)
router.put('/produtos/:id', autenticarJWT, permitirPerfis('admin', 'funcionario'), validarBody(produtoSchema), editarProdutoController)

// Exclui (inativa) um produto (admin/funcionário)
router.delete('/produtos/:id', autenticarJWT, permitirPerfis('admin', 'funcionario'), excluirProdutoController)

// Restaura um produto inativado (admin/funcionário)
router.patch('/produtos/:id/restaurar', autenticarJWT, permitirPerfis('admin', 'funcionario'), restaurarProdutoController)

router.get('/produtos/restaurante/:restauranteId', autenticarJWT, listarProdutosComPrecoPersonalizado)

export default router