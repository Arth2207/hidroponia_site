import express from 'express'
import { cadastro } from '../controllers/usuarioController.js'

const router = express.Router()

router.post('/cadastro', cadastro)
router.post('/login', login)

export default router