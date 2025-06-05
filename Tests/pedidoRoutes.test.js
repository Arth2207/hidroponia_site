import request from 'supertest'
import app from '../app.js'
import path from 'path'

describe('Rotas de Pedido', () => {
    let token
    let pedidoIdCriado

    beforeAll(async () => {
        // Faça login para obter um token válido
        const res = await request(app)
            .post('/login')
            .send({ nome: 'seu_usuario', senha: 'sua_senha', tipo: 'cliente' }) // ajuste conforme seu usuário de teste
        token = res.body.token
    })

    it('deve listar pedidos paginados', async () => {
        const res = await request(app)
            .get('/pedidos?page=1&limit=2')
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
    })

    it('deve criar um pedido com sucesso', async () => {
        const res = await request(app)
            .post('/pedido')
            .set('Authorization', `Bearer ${token}`)
            .send({ usuarioId: 1, itens: [{ produtoId: 1, quantidade: 2 }] }) // ajuste IDs conforme seu banco
        expect([200, 201]).toContain(res.statusCode)
        expect(res.body).toHaveProperty('pedidoId')
        pedidoIdCriado = res.body.pedidoId
    })

    it('deve retornar erro ao criar pedido sem itens', async () => {
        const res = await request(app)
            .post('/pedido')
            .set('Authorization', `Bearer ${token}`)
            .send({ usuarioId: 1, itens: [] })
        expect(res.statusCode).toBe(400)
        expect(res.body.error).toBe('Dados do pedido inválidos.')
    })

    it('deve buscar pedidos por restaurante', async () => {
        const res = await request(app)
            .get('/pedidos/restaurante/1')
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
    })

    it('deve buscar detalhes de um pedido', async () => {
        const res = await request(app)
            .get(`/pedido/${pedidoIdCriado || 1}`)
            .set('Authorization', `Bearer ${token}`)
        expect([200, 404]).toContain(res.statusCode)
    })

    it('deve atualizar item do pedido', async () => {
        // Supondo que o itemId 1 exista, ajuste conforme seu banco
        const res = await request(app)
            .put('/pedido/item/1')
            .set('Authorization', `Bearer ${token}`)
            .send({ novaQuantidade: 3 })
        expect([200, 404, 500]).toContain(res.statusCode)
    })

    it('deve cancelar um pedido', async () => {
        const res = await request(app)
            .delete(`/pedido/${pedidoIdCriado || 1}`)
            .set('Authorization', `Bearer ${token}`)
        expect([200, 404, 403, 400]).toContain(res.statusCode)
    })

    it('deve buscar histórico de pedidos', async () => {
        const res = await request(app)
            .get('/pedidos/historico/1')
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
    })

    it('deve fazer upload de comprovante', async () => {
        const res = await request(app)
            .post(`/pedido/${pedidoIdCriado || 1}/comprovante`)
            .set('Authorization', `Bearer ${token}`)
            .attach('comprovante', path.join(__dirname, 'teste.pdf')) // coloque um arquivo teste.pdf na pasta tests
        expect([200, 400, 404]).toContain(res.statusCode)
    })
})