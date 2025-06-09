import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import usuarioRoutes from './routes/usuarioRoutes.js'
import produtoRoutes from './routes/produtoRoutes.js'
import pedidoRoutes from './routes/pedidoRoutes.js'
import produtoManutencaoRoutes from './routes/produtoManutencaoRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Use as rotas separadas
app.use(usuarioRoutes)
app.use(produtoRoutes)
app.use(produtoManutencaoRoutes)
app.use(pedidoRoutes)
app.use(adminRoutes)



const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})

export default app