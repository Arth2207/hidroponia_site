import express from 'express'
import { postAviso, getAvisos, deleteAviso } from '../controllers/avisoController.js'
import { autenticarJWT, permitirPerfis } from '../middlewares/auth.js'

const router = express.Router()

// Criar aviso (admin/funcionario)
router.post('/avisos', autenticarJWT, permitirPerfis('admin', 'funcionario'), postAviso)

// Listar avisos (todos autenticados)
router.get('/avisos', autenticarJWT, getAvisos)

// Remover aviso (admin/funcionario)
router.delete('/avisos/:id', autenticarJWT, permitirPerfis('admin', 'funcionario'), deleteAviso)

export default router