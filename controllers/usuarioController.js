import bcrypt from 'bcrypt'
import { buscarRestaurantePorNome, criarRestaurante, criarUsuario,
    salvarRefreshToken, buscarRefreshToken, removerRefreshToken,
    salvarTokenReset, buscarUsuarioPorResetToken, atualizarSenha,
    buscarUsuarioPorId, atualizarPerfil,
 } from '../models/usuarioModel.js'
import pool from '../conections/database.js'
import { registrarAuditoria, listarAuditoriaPorUsuario } from '../models/auditoriaModels.js'
import { buscarUsuarioPorEmail } from '../models/usuarioModel.js'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

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
        
        await registrarAuditoria(usuario.id, 'Login realizado')

        res.status(201).json({
            message: 'Cadastro realizado com sucesso.',
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo,
                restauranteId: usuario.restaurante_id
            }
        })
    } catch (error) {
        console.error(error)
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
            await registrarAuditoria(null, `Falha de login: usuário "${nome}" não encontrado`)
            return res.status(404).json({ error: 'Usuário não encontrado.' })
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha_hash)
        if (!senhaValida) {
            await registrarAuditoria(usuario.id, 'Falha de login: senha incorreta')
            return res.status(401).json({ error: 'Senha incorreta.' })
        }
        const token = jwt.sign(
            {
             id: usuario.id,
             nome: usuario.nome,
             tipo: usuario.tipo,
             restauranteId: usuario.restaurante_id
         },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        )
        const refreshToken = crypto.randomBytes(40).toString('hex')

        await salvarRefreshToken(usuario.id, refreshToken)
        
        await registrarAuditoria(usuario.id, 'Login realizado')

        res.status(200).json({
            usuario: {
            id: usuario.id,
            nome: usuario.nome,
            tipo: usuario.tipo,
            restauranteId: usuario.restaurante_id
            },
            token,
            refreshToken
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao realizar login.' })
    }
}

export async function getMe(req, res) {
    const usuarioId = req.usuario.id
    const usuario = await buscarUsuarioPorId(usuarioId)
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado.' })
    res.status(200).json(usuario)
}

export async function atualizarPerfilController(req, res) {
    const usuarioId = req.usuario.id
    const { nome, email } = req.body
    await atualizarPerfil(usuarioId, { nome, email })
    await registrarAuditoria(usuarioId, 'Perfil atualizado')
    res.status(200).json({ message: 'Perfil atualizado com sucesso.' })
}

export async function refreshToken(req, res) {
    const { refreshToken } = req.body
    if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token não fornecido.' })
    }

    const tokenDb = await buscarRefreshToken(refreshToken)
    if (!tokenDb) {
        return res.status(401).json({ error: 'Refresh token inválido.' })
    }

    // Busque o usuário pelo ID
    const usuario = await buscarUsuarioPorId(tokenDb.usuario_id)
    if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado.' })
    }

    const token = jwt.sign(
        {
            id: usuario.id,
            nome: usuario.nome,
            tipo: usuario.tipo,
            restauranteId: usuario.restaurante_id
        },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    )

    res.status(200).json({ token })
}

export async function trocarSenha(req, res) {
    const usuarioId = req.usuario.id // do JWT
    const { senhaAtual, novaSenha } = req.body
    const usuario = await buscarUsuarioPorId(usuarioId)
    const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha_hash)
    if (!senhaValida) return res.status(401).json({ error: 'Senha atual incorreta.' })
    const senha_hash = await bcrypt.hash(novaSenha, 10)
    await atualizarSenha(usuarioId, senha_hash)
    res.status(200).json({ message: 'Senha alterada com sucesso.' })
}


export async function logout(req, res) {
    const { refreshToken } = req.body
    if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token não fornecido.' })
    }
    await removerRefreshToken(refreshToken)
    res.status(200).json({ message: 'Logout realizado com sucesso.' })
    await registrarAuditoria(req.usuario.id, 'Logout realizado')
}


export async function esqueciSenha(req, res) {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email é obrigatório.' })

    const token = crypto.randomBytes(20).toString('hex')
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hora
    await salvarTokenReset(email, token, expires)
    await enviarEmailReset(email, token)
    res.status(200).json({ message: 'Email de recuperação enviado.' })
}

export async function resetSenha(req, res) {
    const { token, novaSenha } = req.body
    if (!token || !novaSenha) return res.status(400).json({ error: 'Token e nova senha são obrigatórios.' })

    const usuario = await buscarUsuarioPorResetToken(token)
    if (!usuario) return res.status(400).json({ error: 'Token inválido.' })

    const senha_hash = await bcrypt.hash(novaSenha, 10)
    await atualizarSenha(usuario.id, senha_hash)
    res.status(200).json({ message: 'Senha atualizada com sucesso.' })
    await registrarAuditoria(usuario.id, 'Senha redefinida via recuperação') 
}


export async function getAuditoria(req, res) {
    const usuarioId = req.usuario.id
    const logs = await listarAuditoriaPorUsuario(usuarioId)
    res.status(200).json(logs)
}

export async function excluirConta(req, res) {
    const usuarioId = req.usuario.id
    await excluirUsuario(usuarioId)
    await registrarAuditoria(usuarioId, 'Conta excluída')
    res.status(200).json({ message: 'Conta excluída com sucesso.' })
}

