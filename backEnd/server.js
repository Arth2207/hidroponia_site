import app from './app.js'
import http from 'http'
import { Server } from 'socket.io'

const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*' } })

// Exemplo de avisos em memória
let avisos = []

io.on('connection', (socket) => {
    socket.emit('avisos', avisos)

    socket.on('novo-aviso', (aviso) => {
        avisos.push(aviso)
        io.emit('avisos', avisos)
    })

    socket.on('remover-aviso', (id) => {
        avisos = avisos.filter(a => a.id !== id)
        io.emit('avisos', avisos)
    })
})

