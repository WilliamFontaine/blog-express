const express = require('express');
const ProductsController = require('../controllers/ProductsController');
const AuthGuard = require('../guards/AuthGuard');

const router = express.Router();

module.exports = (app) => {
    router.get('/', ProductsController.showAll);

    router.get('/new', AuthGuard.checkUserLogged, ProductsController.showAdd);
    router.post('/new', AuthGuard.checkUserLogged, ProductsController.handleAdd);

    router.get('/:id/edit', AuthGuard.checkUserLogged, ProductsController.showEdit);
    router.post('/:id/edit', AuthGuard.checkUserLogged, ProductsController.handleEdit);

    router.get('/:id/delete', AuthGuard.checkUserLogged, ProductsController.handleDelete);

    router.get('/:id', ProductsController.showDetails);

    app.use('/products', router);
}