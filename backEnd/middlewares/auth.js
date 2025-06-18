import jwt from 'jsonwebtoken';

export function autenticarJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Se não houver token no formato correto, nega o acesso.
        return res.status(401).json({ error: 'Token não fornecido ou mal formatado.' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedPayload) => {
        if (err) {
            // Se o token for inválido ou expirado.
            console.error("ERRO NA VERIFICAÇÃO DO JWT:", err.message);
            return res.status(403).json({ error: 'Token inválido ou expirado.' });
        }
        
        // DEBUG: Mostra no console do backend o que foi decodificado do token.
        console.log("Payload do Token Decodificado:", decodedPayload);
        
        // Anexa o payload decodificado ao objeto 'req' para ser usado pelos controllers.
        req.user = decodedPayload;
        
        // Passa para a próxima função (o controller).
        next();
    });
}

export function permitirPerfis(...perfisPermitidos) {
    // O método .flat() corrige o problema de array aninhado, transformando [['admin']] em ['admin']
    const perfisFlat = perfisPermitidos.flat();

    return (req, res, next) => {
        // Adicionando um log para ter certeza do que está sendo comparado
        console.log(`PERFIS PERMITIDOS: [${perfisFlat.join(', ')}] | PERFIL DO USUÁRIO: ${req.user?.tipo}`);

        if (req.user && req.user.tipo && perfisFlat.includes(req.user.tipo)) {
            // Perfil correto, pode prosseguir
            next();
        } else {
            // Perfil incorreto, acesso negado
            res.status(403).json({ error: 'Acesso negado: o perfil do usuário não tem permissão.' });
        }
    };
}