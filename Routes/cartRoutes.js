const express = require('express');
const cartController = require('../controllers/cartController');
const authorization = require('../middleware/authorization');
const router = express.Router();

module.exports = (io) => {
    /**
     * @swagger
     * components:
     *   schemas:
     *     Cart:
     *       type: object
     *       required:
     *         - products
     *       properties:
     *         id:
     *           type: string
     *           description: O ID auto-gerado do carrinho
     *         products:
     *           type: array
     *           items:
     *             type: object
     *             properties:
     *               productId:
     *                 type: string
     *               quantity:
     *                 type: integer
     *           description: Lista de produtos no carrinho
     *       example:
     *         products:
     *           - productId: "ProdutoID"
     *             quantity: 2
     */

    /**
     * @swagger
     * tags:
     *   name: Carrinhos
     *   description: API para gerenciamento de carrinhos
     */

    /**
     * @swagger
     * /api/carts/{cid}:
     *   get:
     *     summary: Retorna o carrinho pelo ID
     *     tags: [Carrinhos]
     *     parameters:
     *       - in: path
     *         name: cid
     *         schema:
     *           type: string
     *         required: true
     *         description: O ID do carrinho
     *     responses:
     *       200:
     *         description: Detalhes do carrinho
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Cart'
     */
    router.get('/:cid', cartController.getCart);

    /**
     * @swagger
     * /api/carts/{cid}/product/{pid}:
     *   post:
     *     summary: Adiciona um produto ao carrinho
     *     tags: [Carrinhos]
     *     parameters:
     *       - in: path
     *         name: cid
     *         schema:
     *           type: string
     *         required: true
     *         description: O ID do carrinho
     *       - in: path
     *         name: pid
     *         schema:
     *           type: string
     *         required: true
     *         description: O ID do produto
     *     responses:
     *       201:
     *         description: Produto adicionado com sucesso ao carrinho
     */
    router.post('/:cid/product/:pid', (req, res) => cartController.addProductToCart(io, req, res));

    /**
     * @swagger
     * /api/carts/{cid}:
     *   put:
     *     summary: Atualiza os produtos no carrinho
     *     tags: [Carrinhos]
     *     parameters:
     *       - in: path
     *         name: cid
     *         schema:
     *           type: string
     *         required: true
     *         description: O ID do carrinho
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Cart'
     *     responses:
     *       200:
     *         description: Carrinho atualizado com sucesso
     */
    router.put('/:cid', (req, res) => cartController.updateCart(io, req, res));

    /**
     * @swagger
     * /api/carts/{cid}/product/{pid}:
     *   put:
     *     summary: Atualiza a quantidade de um produto no carrinho
     *     tags: [Carrinhos]
     *     parameters:
     *       - in: path
     *         name: cid
     *         schema:
     *           type: string
     *         required: true
     *         description: O ID do carrinho
     *       - in: path
     *         name: pid
     *         schema:
     *           type: string
     *         required: true
     *         description: O ID do produto
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               quantity:
     *                 type: integer
     *                 description: A nova quantidade do produto
     *             example:
     *               quantity: 3
     *     responses:
     *       200:
     *         description: Quantidade do produto no carrinho atualizada com sucesso
     */
    router.put('/:cid/product/:pid', (req, res) => cartController.updateProductQuantity(io, req, res));

    /**
     * @swagger
     * /api/carts/{cid}:
     *   delete:
     *     summary: Limpa o carrinho pelo ID
     *     tags: [Carrinhos]
     *     parameters:
     *       - in: path
     *         name: cid
     *         schema:
     *           type: string
     *         required: true
     *         description: O ID do carrinho
     *     responses:
     *       204:
     *         description: Carrinho limpo com sucesso
     */
    router.delete('/:cid', (req, res) => cartController.clearCart(io, req, res));

    return router;
};
