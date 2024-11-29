const express = require('express');
const passport = require('passport');
const User = require('../dao/models/user');
const UserDTO = require('../DTO/userDTO');
const router = express.Router();

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = new User({ email, password, role: email === 'adminCoder@coder.com' ? 'admin' : 'user' });
        await user.save();
        res.redirect('/login');
    } catch (error) {
        res.status(500).send('Erro ao registrar o usuário.');
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/products',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/auth/github/callback', passport.authenticate('github', {
    successRedirect: '/products',
    failureRedirect: '/login'
}));

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

router.get('/current', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const userDTO = new UserDTO(req.user);
    res.json(userDTO);
});

module.exports = router;
