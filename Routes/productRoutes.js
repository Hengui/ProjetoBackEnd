const express = require('express');
const productController = require('../controllers/productController');
const authorization = require('../middleware/authorization');
const generateMockProducts = require('../mock/generateMockProducts');
const router = express.Router();

module.exports = (io) => {
    router.get('/', productController.getProducts);
    router.post('/', authorization.isAdmin, (req, res) => productController.createProduct(io, req, res));
    router.delete('/:pid', authorization.isAdmin, (req, res) => productController.deleteProduct(io, req, res));
    
    router.get('/mockingproducts', (req, res) => {
        const mockProducts = generateMockProducts();
        res.json(mockProducts);
    });

    return router;
};
