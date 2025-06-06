import express from 'express';
import {getProdutos, buscarProdutoController, cadastrarProdutoController, editarProdutoController, excluirProdutoController, restaurarProdutoController} from '../controllers/produtoController.js';
import { autenticarJWT, permitirPerfis } from '../middlewares/auth.js'
import { validarBody, produtoSchema } from '../middlewares/validacaoJoi.js'

const router = express.Router()


router.get('/produtos', autenticarJWT, getProdutos)
router.get('/produtos/:id', autenticarJWT, buscarProdutoController)
router.post('/produtos', autenticarJWT, permitirPerfis('admin', 'funcionario'),validarBody(produtoSchema), cadastrarProdutoController)
router.put('/produtos/:id', autenticarJWT, permitirPerfis('admin', 'funcionario'), validarBody(produtoSchema), editarProdutoController)
router.delete('/produtos/:id', autenticarJWT, permitirPerfis('admin', 'funcionario'), excluirProdutoController)
router.patch('/produtos/:id/restaurar', autenticarJWT, permitirPerfis('admin', 'funcionario'), restaurarProdutoController)

export default router