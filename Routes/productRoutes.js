const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();

module.exports = (io) => {
    router.get('/', productController.getProducts);
    router.post('/', (req, res) => productController.createProduct(io, req, res));
    router.delete('/:pid', (req, res) => productController.deleteProduct(io, req, res));
    
    return router;
};
