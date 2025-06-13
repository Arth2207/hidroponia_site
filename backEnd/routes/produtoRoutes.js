import express from 'express';
import {getProdutos, buscarProdutoController} from '../controllers/produtoController.js';
import { autenticarJWT } from '../middlewares/auth.js'

const router = express.Router()

// Lista todos os produtos (cliente)
router.get('/produtos', /*autenticarJWT,*/ getProdutos)

// Busca um produto específico pelo ID (cliente)
router.get('/produtos/:id', /*autenticarJWT,*/ buscarProdutoController)

export default router