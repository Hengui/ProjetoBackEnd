const express = require('express');
const cartController = require('../controllers/cartController');
const authorization = require('../middleware/authorization');
const router = express.Router();

module.exports = (io) => {
    router.post('/', authorization.isUser, (req, res) => cartController.createCart(io, req, res));
    router.get('/:cid', authorization.isUser, cartController.getCart);
    router.post('/:cid/product/:pid', authorization.isUser, (req, res) => cartController.addProductToCart(io, req, res));
    router.put('/:cid', authorization.isUser, (req, res) => cartController.updateCart(io, req, res));
    router.put('/:cid/products/:pid', authorization.isUser, (req, res) => cartController.updateProductQuantity(io, req, res));
    router.delete('/:cid', authorization.isUser, (req, res) => cartController.clearCart(io, req, res));
    router.post('/:cid/purchase', authorization.isUser, cartController.purchaseCart);
    
    return router;
};
