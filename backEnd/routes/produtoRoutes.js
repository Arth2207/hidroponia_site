import express from 'express';
import {getProduto, buscarProdutoController} from '../controllers/produtoController.js';
import { autenticarJWT } from '../middlewares/auth.js'

const router = express.Router()

// Lista todos os produtos (cliente)
router.get('/produtos', autenticarJWT, getProduto)

// Busca um produto específico pelo ID (cliente)
router.get('/produtos/:id', autenticarJWT, buscarProdutoController)

export default router