const express = require('express');
const AuthController = require('../controllers/AuthController');
const AuthGuard = require('../guards/AuthGuard');

const router = express.Router();

module.exports = (app) => {
    router.get('/login', AuthGuard.checkUserLogged, AuthController.showLogin);
    router.post('/login', AuthGuard.checkUserLogged, AuthController.handleLogin);

    router.get('/register', AuthGuard.checkUserLogged, AuthController.showRegister);
    router.post('/register', AuthGuard.checkUserLogged, AuthController.handleRegister);

    router.get('/logout', AuthController.handleLogout);

    app.use('/auth', router);
}