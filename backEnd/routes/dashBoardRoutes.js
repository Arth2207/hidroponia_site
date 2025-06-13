import express from 'express'
import { getDashboard, getAdminDashboard } from '../controllers/dashboardController.js'
import { autenticarJWT, permitirPerfis } from '../middlewares/auth.js'

const router = express.Router()


router.get('/dashboard', autenticarJWT, getDashboard)
router.get('/admin/dashboard', autenticarJWT, permitirPerfis(['admin']), getAdminDashboard)


export default router