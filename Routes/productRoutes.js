const express = require('express');
const productController = require('../controllers/productController');
const authorization = require('../middleware/authorization');
const generateMockProducts = require('../mocking/generateMockProducts');
const router = express.Router();

module.exports = (io) => {
    /**
     * @swagger
     * components:
     *   schemas:
     *     Product:
     *       type: object
     *       required:
     *         - title
     *         - price
     *       properties:
     *         id:
     *           type: string
     *           description: O ID auto-gerado do produto
     *         title:
     *           type: string
     *           description: O título do produto
     *         price:
     *           type: number
     *           description: O preço do produto
     *       example:
     *         title: "Produto Exemplo"
     *         price: 99.99
     */

    /**
     * @swagger
     * tags:
     *   name: Produtos
     *   description: API para gerenciamento de produtos
     */

    /**
     * @swagger
     * /api/products:
     *   get:
     *     summary: Retorna a lista de todos os produtos
     *     tags: [Produtos]
     *     responses:
     *       200:
     *         description: A lista de produtos
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Product'
     */
    router.get('/', productController.getProducts);

    /**
     * @swagger
     * /api/products:
     *   post:
     *     summary: Cria um novo produto
     *     tags: [Produtos]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Product'
     *     responses:
     *       201:
     *         description: Produto criado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Product'
     */
    router.post('/', authorization.isAdmin, (req, res) => productController.createProduct(io, req, res));

    /**
     * @swagger
     * /api/products/{pid}:
     *   delete:
     *     summary: Remove um produto pelo ID
     *     tags: [Produtos]
     *     parameters:
     *       - in: path
     *         name: pid
     *         schema:
     *           type: string
     *         required: true
     *         description: O ID do produto
     *     responses:
     *       204:
     *         description: Produto removido com sucesso
     */
    router.delete('/:pid', authorization.isAdmin, (req, res) => productController.deleteProduct(io, req, res));

    // Endpoint para gerar produtos mock
    router.get('/mockingproducts', (req, res) => {
        const mockProducts = generateMockProducts();
        res.json(mockProducts);
    });

    return router;
};
