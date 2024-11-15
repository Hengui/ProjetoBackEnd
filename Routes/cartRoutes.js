const express = require('express');
const cartController = require('../controllers/cartController');
const router = express.Router();

module.exports = (io) => {
    router.post('/', (req, res) => cartController.createCart(io, req, res));
    router.get('/:cid', cartController.getCart);
    router.post('/:cid/product/:pid', (req, res) => cartController.addProductToCart(io, req, res));
    router.put('/:cid', (req, res) => cartController.updateCart(io, req, res));
    router.put('/:cid/products/:pid', (req, res) => cartController.updateProductQuantity(io, req, res));
    router.delete('/:cid', (req, res) => cartController.clearCart(io, req, res));
    
    return router;
};
