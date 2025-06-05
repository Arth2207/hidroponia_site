import jwt from 'jsonwebtoken'

export function autenticarJWT(req, res, next) {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: 'Token não fornecido.' })

    const token = authHeader.split(' ')[1]
     try {
        const usuario = jwt.verify(token, process.env.JWT_SECRET)
        req.usuario = usuario
        next()
    } catch {
        res.status(401).json({ error: 'Token inválido.' })
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
        if (err) return res.status(403).json({ error: 'Token inválido.' })
        req.usuario = usuario
        next()
    })
}