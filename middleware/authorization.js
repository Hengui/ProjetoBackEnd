const authorization = {
    isAdmin: (req, res, next) => {
        if (req.user && req.user.role === 'admin') {
            return next();
        }
        return res.status(403).json({ error: 'Acesso negado: apenas administradores podem acessar' });
    },
    isUser: (req, res, next) => {
        if (req.user && req.user.role === 'user') {
            return next();
        }
        return res.status(403).json({ error: 'Acesso negado: apenas usuários podem acessar' });
    }
};

module.exports = authorization;
