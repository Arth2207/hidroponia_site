import { relatorioFinanceiro } from '../controllers/financeiroController.js'
import { getLogsSistema } from '../controllers/auditoriaController.js'
import { autenticarJWT, permitirPerfis } from '../middlewares/auth.js'
import express from 'express'

const router = express.Router()

// Relatório financeiro agregado (restaurantes + produtos)
router.get( '/financeiro/relatorio',autenticarJWT,permitirPerfis('admin'),relatorioFinanceiro)
router.get('/auditoria/log', autenticarJWT, permitirPerfis(['admin']), getLogsSistema)

export default router