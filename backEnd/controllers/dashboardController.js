import { listarAvisos } from '../models/avisoModel.js'
import { listarPedidosPorRestaurante, listarPedidosRecentesTodosRestaurantes } from '../models/pedidoModel.js'

export async function getDashboard(req, res) {
    try {
        // CORREÇÃO: O middleware anexa os dados em `req.user`, não `req.usuario`.
        const usuario = req.user;

        // Adicionando uma verificação de segurança para garantir que o usuário existe
        if (!usuario || !usuario.restauranteId) {
            return res.status(403).json({ error: 'Dados do usuário inválidos ou não associados a um restaurante.' });
        }

        // Busca avisos ativos
        const avisos = await listarAvisos();
        // Busca pedidos recentes do restaurante do usuário
        const pedidos = await listarPedidosPorRestaurante(usuario.restauranteId);
        
        // Ordena por data decrescente
        pedidos.sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em));
        
        // Pega os 3 mais recentes
        const recentOrders = pedidos.slice(0, 3);
        
        // Último pedido
        const lastOrder = pedidos[0] || null;

        res.json({
            avisos,
            recentOrders,
            lastOrder
        });
    } catch (error) {
        console.error("ERRO NO getDashboard:", error);
        res.status(500).json({ error: 'Erro ao buscar dados do dashboard.' });
    }
}

export async function getAdminDashboard(req, res) {
    try {
        const avisos = await listarAvisos();
        const pedidos = await listarPedidosRecentesTodosRestaurantes(10);

        console.log("Enviando resposta do dashboard admin");
        res.json({
            avisos,
            recentOrders: pedidos,
            lastOrder: pedidos[0] || null
        });
    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Erro ao buscar dados do dashboard admin.' });
        }
    }
}