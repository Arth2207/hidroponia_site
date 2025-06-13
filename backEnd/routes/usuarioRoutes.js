import express from 'express'
import { cadastro, login, refreshToken, logout, esqueciSenha, resetSenha,
    getMe, atualizarPerfilController, trocarSenha, getAuditoria, excluirConta, listarRestaurantes,excluirRestauranteController
 } from '../controllers/usuarioController.js'
import { autenticarJWT } from '../middlewares/auth.js'

const router = express.Router()

// Cadastro de novo usuário
router.post('/cadastro', cadastro)
// Login do usuário
router.post('/login', login)
// Gera novo token de acesso usando refresh token
router.post('/refresh-token', refreshToken)
// Logout do usuário
router.post('/logout', logout)
// Solicita recuperação de senha
router.post('/esqueci-senha', esqueciSenha)
// Redefine senha usando token enviado por email
router.post('/reset-senha', resetSenha)
// Busca dados do usuário autenticado
router.get('/me', autenticarJWT, getMe)
// Atualiza perfil do usuário autenticado
router.put('/perfil', autenticarJWT, atualizarPerfilController)
// Troca senha do usuário autenticado
router.post('/trocar-senha', autenticarJWT, trocarSenha)
// Busca logs/auditoria do usuário autenticado
router.get('/auditoria', autenticarJWT, getAuditoria)
// Exclui a conta do usuário autenticado
router.delete('/excluir-conta', autenticarJWT, excluirConta)

router.get('/restaurantes', listarRestaurantes);

router.delete('/restaurantes/:id', excluirRestauranteController);

export default router