const express = require('express');
const productController = require('../controllers/productController');
const authorization = require('../middleware/authorization');
const router = express.Router();

module.exports = (io) => {
    router.get('/', productController.getProducts);
    router.post('/', authorization.isAdmin, (req, res) => productController.createProduct(io, req, res));
    router.delete('/:pid', authorization.isAdmin, (req, res) => productController.deleteProduct(io, req, res));
    
    return router;
};
