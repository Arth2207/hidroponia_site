import express from 'express';
import {getProduto, buscarProdutoController} from '../controllers/produtoController.js';
import { autenticarJWT } from '../middlewares/auth.js'


const router = express.Router();

router.get('/produtos', autenticarJWT, getProduto)
router.get('/produtos/:id', autenticarJWT, buscarProdutoController)


export default router;