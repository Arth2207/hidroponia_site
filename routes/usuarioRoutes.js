import express from 'express'
import { cadastro, login, refreshToken, logout, esqueciSenha, resetSenha,
    getMe, atualizarPerfilController, trocarSenha, getAuditoria, excluirConta
 } from '../controllers/usuarioController.js'
import { autenticarJWT } from '../middlewares/auth.js'

const router = express.Router()

router.post('/cadastro', cadastro)
router.post('/login', login)
router.post('/refresh-token', refreshToken)
router.post('/logout', logout)
router.post('/esqueci-senha', esqueciSenha)
router.post('/reset-senha', resetSenha)
router.get('/me', autenticarJWT, getMe)
router.put('/perfil', autenticarJWT, atualizarPerfilController)
router.post('/trocar-senha', autenticarJWT, trocarSenha)
router.get('/auditoria', autenticarJWT, getAuditoria)
router.delete('/excluir-conta', autenticarJWT, excluirConta)

export default router