import bcrypt from 'bcrypt'
import { buscarRestaurantePorNome, criarRestaurante, criarUsuario } from '../models/usuarioModel.js'
import pool from '../conections/database.js'
import { buscarUsuarioPorEmail } from '../models/usuarioModel.js'

export async function cadastro(req, res) {
    const { nome, email, senha, tipo, restaurante_nome, cnpj, telefone } = req.body
    if (!nome || !email || !senha || !tipo) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' })
    }

    try {
        let restauranteId = null
        if (tipo === 'cliente') {
            let restaurante = await buscarRestaurantePorNome(restaurante_nome)
            if (restaurante) {
                restauranteId = restaurante.id
            } else {
                restaurante = await criarRestaurante({ nome: restaurante_nome, cnpj, telefone })
                restauranteId = restaurante.id
            }
        }
        const senha_hash = await bcrypt.hash(senha, 10)
        const usuario = await criarUsuario({ nome, email, senha_hash, tipo, restauranteId })
        res.status(201).json(usuario)
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ error: 'Email já cadastrado.' })
        } else {
            res.status(500).json({ error: 'Erro ao cadastrar usuário.' })
        }
    }
}

export async function login(req, res) {
    const { nome, senha, tipo } = req.body
    if (!nome || !senha || !tipo) {
        return res.status(400).json({ error: 'Nome e senha são obrigatórios.' })
    }

    try {
        const usuario = await buscarUsuarioPorEmail(nome, tipo)
        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado.' })
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha_hash)
        if (!senhaValida) {
            return res.status(401).json({ error: 'Senha incorreta.' })
        }

        res.status(200).json({
            id: usuario.id,
            nome: usuario.nome,
            tipo: usuario.tipo,
            restauranteId: usuario.restaurante_id
        })
    } catch (error) {
        res.status(500).json({ error: 'Erro ao realizar login.' })
    }
}