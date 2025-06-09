import { criarPedido, listarPedidos, listarPedidosPorRestaurante, 
 editarItemPedido, cancelarPedido, buscarPedidoDetalhado, listarPedidosPorFiltro,
editarObservacaoItemPedido, buscarObservacaoItemPedido,
 listarRestaurantesSemPedido, matrizPedidosPorDia, salvarObservacaoPedido, 
 buscarObservacaoPedido, usuarioPodeEditarObservacaoItem  } from '../models/pedidoModel.js'

import ExcelJS from 'exceljs'
import path from 'path'

// Constants
const TOTAL_SHEET_HEADER = ['COD.', 'TOTAL', 'HORTA', 'DIFERENÇA']



export async function postPedido(req, res) {
    const { usuarioId, itens, separadorId } = req.body // <-- Adicione separadorId aqui
    if (!usuarioId || !Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({ error: 'Dados do pedido inválidos.' })
    }
    try {
        // Passe separadorId para o model se for atribuído no momento da criação
        const pedidoId = await criarPedido({ usuarioId, itens, separadorId })
        res.status(201).json({ pedidoId })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao criar pedido.' })
    }
}

export async function getPedidos(req, res) {
        const { page = 1, limit = 10 } = req.query
    try {
        const pedidos = await listarPedidos(page, limit)
        res.status(200).json(pedidos)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao listar pedidos.' })
    }
}

export async function getPedidosPorRestaurante(req, res) {
    const { restauranteId } = req.params
    try {
        const pedidos = await listarPedidosPorRestaurante(restauranteId)
        res.status(200).json(pedidos)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao listar pedidos do restaurante.' })
    }
}

export async function putItemPedido(req, res) {
    const { itemId } = req.params
    const { novaQuantidade } = req.body
    const usuario = req.usuario

    try {
        // Busca o pedido pelo item para checar o dono
        const pedido = await buscarPedidoPorItemId(itemId)
        if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado.' })

        // Permite se for admin/funcionario OU dono do pedido
        if (
            usuario.tipo !== 'admin' &&
            usuario.tipo !== 'funcionario' &&
            pedido.usuario_id !== usuario.id
        ) {
            return res.status(403).json({ error: 'Acesso negado.' })
        }

        await editarItemPedido(itemId, novaQuantidade)
        res.status(200).json({ message: 'Item atualizado com sucesso.' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao atualizar item do pedido.' })
    }
}


export async function deletePedido(req, res) {
    const { pedidoId } = req.params
    const usuario = req.usuario

    try {
        const pedido = await buscarPedidoPorId(pedidoId)
        if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado.' })

        if (
            usuario.perfil !== 'admin' &&
            usuario.perfil !== 'funcionario' &&
            pedido.restaurante_id !== Number(usuario.restauranteId)
        ) {
            return res.status(403).json({ error: 'Acesso negado.' })
        }

        if (pedido.status !== 'pendente') {
            return res.status(400).json({ error: 'Só é possível cancelar pedidos pendentes.' })
        }

        await cancelarPedido(pedidoId)
        res.status(200).json({ message: 'Pedido cancelado com sucesso.' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao cancelar pedido.' })
    }
}

export async function getPedidoDetalhado(req, res) {
    const { pedidoId } = req.params
    try {
        const detalhes = await buscarPedidoDetalhado(pedidoId)
        if (!detalhes.length) return res.status(404).json({ error: 'Pedido não encontrado.' })
        res.status(200).json(detalhes)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao buscar detalhes do pedido.' })
    }
}

export async function getHistoricoPedidos(req, res) {
    const { restauranteId } = req.params
    const { dataInicio, dataFim, status } = req.query
    try {
        const pedidos = await listarPedidosPorFiltro(restauranteId, dataInicio, dataFim, status)
        res.status(200).json(pedidos)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao buscar histórico de pedidos.' })
    }
}

export async function uploadComprovante(req, res) {
    const { pedidoId } = req.params
    if (!req.file) {
        return res.status(400).json({ error: 'Arquivo não enviado.' })
    }
    const caminhoComprovante = req.file.path

    try {
        await salvarComprovante(pedidoId, caminhoComprovante)
        res.status(200).json({ message: 'Comprovante enviado com sucesso.', comprovante: caminhoComprovante })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao salvar comprovante.' })
    }
}

export async function getResumoPedidos(req, res) {
    const { dataInicio, dataFim, page = 1, limit = 20, status, restauranteId } = req.query
    try {
        const resumo = await listarResumoPedidos(
            dataInicio,
            dataFim,
            Number(page),
            Number(limit),
            status,
            restauranteId
        )
        res.status(200).json(resumo)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao buscar resumo dos pedidos.' })
    }
}

export async function putObservacaoItemPedido(req, res) {
    const { itemId } = req.params
    const { observacao } = req.body
    const usuarioId = req.usuario.id

    const podeEditar = await usuarioPodeEditarObservacaoItem(itemId, usuarioId)
    if (!podeEditar) {
        return res.status(403).json({ error: 'Acesso negado.' })
    }

    try {
        await editarObservacaoItemPedido(itemId, observacao)
        res.status(200).json({ message: 'Observação atualizada com sucesso.' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao atualizar observação.' })
    }
}

export async function getObservacaoItemPedido(req, res) {
    const { itemId } = req.params
    try {
        const observacao = await buscarObservacaoItemPedido(itemId)
        res.status(200).json({ observacao })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao buscar observação.' })
    }
}

export async function getRestaurantesSemPedido(req, res) {
    const { dataEntrega } = req.query
    if (!dataEntrega) {
        return res.status(400).json({ error: 'Informe a dataEntrega.' })
    }
    try {
        const restaurantes = await listarRestaurantesSemPedido(dataEntrega)
        res.status(200).json(restaurantes)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao buscar restaurantes sem pedido.' })
    }
}




export async function exportarPedidosParaPlanilha(req, res) {
    const { dataEntrega } = req.query
    if (!dataEntrega) {
        return res.status(400).json({ error: 'Informe a dataEntrega.' })
    }

    // Carrega o modelo
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(path.join(process.cwd(), 'planilhas', 'modelo.xlsx'))
    const sheet = workbook.getWorksheet('HBJ') // ou o nome da aba do seu modelo

    // Busca dados do dia
    const { produtos, restaurantes, pedidos } = await matrizPedidosPorDia(dataEntrega)

    // Mapeia colunas (hortaliças) e linhas (restaurantes) do modelo
    // Colunas: C1, D1, E1... (col 3 em diante)
    const colunasHortalicas = {}
    sheet.getRow(1).eachCell((cell, colNumber) => {
        if (colNumber >= 3 && cell.value) {
            colunasHortalicas[cell.value.toString().trim().toUpperCase()] = colNumber
        }
    })

    // Linhas: A3, A4, A5... (linha 3 em diante)
    const linhasRestaurantes = {}
    sheet.eachRow((row, rowNumber) => {
        if (rowNumber >= 3) {
            const nomeRestaurante = row.getCell(1).value
            if (nomeRestaurante) {
                linhasRestaurantes[nomeRestaurante.toString().trim().toUpperCase()] = rowNumber
            }
        }
    })

    // Preencher células
    pedidos.forEach(pedido => {
        const nomeRestaurante = pedido.restaurante.toString().trim().toUpperCase()
        const nomeProduto = pedido.produto.toString().trim().toUpperCase()
        const rowNumber = linhasRestaurantes[nomeRestaurante]
        const colNumber = colunasHortalicas[nomeProduto]
        if (rowNumber && colNumber) {
            sheet.getRow(rowNumber).getCell(colNumber).value = Number(pedido.quantidade)
        }
    })

        const restaurantesQuePediram = new Set(pedidos.map(p => p.restaurante.toString().trim().toUpperCase()))
        const linhasParaRemover = Object.entries(linhasRestaurantes)
         .filter(([nomeRestaurante]) => !restaurantesQuePediram.has(nomeRestaurante))
         .map(([, rowNumber]) => rowNumber)
         .sort((a, b) => b - a)
        linhasParaRemover.forEach(rowNumber => {
         sheet.spliceRows(rowNumber, 1)
    })

    let abaTotal = workbook.getWorksheet('TOTAL')
    if (!abaTotal) {
      abaTotal = workbook.addWorksheet('TOTAL')
    } else {
    // Limpa linhas antigas
       while (abaTotal.rowCount > 0) {
        abaTotal.spliceRows(1, 1)
       }
    }


    abaTotal.addRow(TOTAL_SHEET_HEADER)


    const totais = {}
    pedidos.forEach(pedido => {
     const nomeProduto = pedido.produto.toString().trim().toUpperCase()
     totais[nomeProduto] = (totais[nomeProduto] || 0) + Number(pedido.quantidade)
     })


    Object.entries(colunasHortalicas).forEach(([hortalica], idx) => {
      const total = totais[hortalica] || 0
      const row = abaTotal.addRow([hortalica, total, '', null])
      row.getCell(4).value = { formula: `B${idx + 2}-C${idx + 2}` }
     })


    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename=pedidos_${dataEntrega}.xlsx`)
    await workbook.xlsx.write(res)
    res.end()
}

export async function putObservacaoPedido(req, res) {
    const { pedidoId } = req.params
    const { observacao } = req.body
    const usuario = req.usuario

    // Só o cliente dono do pedido pode editar
    const pedido = await buscarPedidoPorId(pedidoId)
    if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado.' })
    if (usuario.tipo !== 'admin' && usuario.tipo !== 'funcionario' && pedido.restaurante_id !== usuario.restauranteId) {
        return res.status(403).json({ error: 'Acesso negado.' })
    }

    try {
        await salvarObservacaoPedido(pedidoId, observacao)
        res.status(200).json({ message: 'Observação salva com sucesso.' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao salvar observação.' })
    }
}

export async function getObservacaoPedido(req, res) {
    const { pedidoId } = req.params
    const usuario = req.usuario

    const pedido = await buscarPedidoPorId(pedidoId)
    if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado.' })
    // Só o cliente dono, admin ou funcionário pode ver
    if (usuario.tipo !== 'admin' && usuario.tipo !== 'funcionario' && pedido.restaurante_id !== usuario.restauranteId) {
        return res.status(403).json({ error: 'Acesso negado.' })
    }

    try {
        const observacao = await buscarObservacaoPedido(pedidoId)
        res.status(200).json({ observacao })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao buscar observação.' })
    }
}

