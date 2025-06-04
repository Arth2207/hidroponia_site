import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import usuarioRoutes from './routes/usuarioRoutes.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Use as rotas separadas
app.use(usuarioRoutes)



const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})