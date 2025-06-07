import express from 'express'
import { postAviso, getAvisos, deleteAviso } from '../controllers/avisoController.js'
import { autenticarJWT, permitirPerfis } from '../middlewares/auth.js'

const router = express.Router()

// Cria um novo aviso (admin/funcionário)
router.post('/avisos', autenticarJWT, permitirPerfis('admin', 'funcionario'), postAviso)

// Lista todos os avisos ativos (todos autenticados)
router.get('/avisos', autenticarJWT, getAvisos)

// Remove (desativa) um aviso (admin/funcionário)
router.delete('/avisos/:id', autenticarJWT, permitirPerfis('admin', 'funcionario'), deleteAviso)

export default router