import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import usuarioRoutes from './routes/usuarioRoutes.js'
import produtoRoutes from './routes/produtoRoutes.js'
import pedidoRoutes from './routes/pedidoRoutes.js'
import produtoManutencaoRoutes from './routes/produtoManutencaoRoutes.js'
import adminRouter from './routes/adminRoutes.js'
import pedidomanutencaoRouter from './routes/pedidoManutençãoRouter.js'
import avisoRouter from './routes/avisoRouter.js'
import separadorRoutes from './routes/separadorRoutes.js'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Use as rotas separadas
app.use(usuarioRoutes)
app.use(produtoRoutes)
app.use(produtoManutencaoRoutes)
app.use(pedidoRoutes)
app.use(adminRouter)
app.use(pedidomanutencaoRouter)
app.use(avisoRouter)
app.use(separadorRoutes)




const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})

export default app