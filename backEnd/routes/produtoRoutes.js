import express from 'express';
import {getProdutos, buscarProdutoController, listarProdutosComPrecoPersonalizado, getProdutosParaCliente} from '../controllers/produtoController.js';
import { autenticarJWT } from '../middlewares/auth.js'

const router = express.Router()

// Lista todos os produtos (cliente)
router.get('/produtos', autenticarJWT,getProdutos)

// Busca um produto específico pelo ID (cliente)
router.get('/produtos/:id', autenticarJWT, buscarProdutoController)

router.get('/produtos/restaurante/:restauranteId', autenticarJWT,listarProdutosComPrecoPersonalizado)

router.get('/cliente/produtos', autenticarJWT, getProdutosParaCliente);

export default router