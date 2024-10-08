const express = require('express');
const Cart = require('../dao/models/cart');
const Product = require('../dao/models/product');
const router = express.Router();

module.exports = (io) => {
    // Adicionar novo carrinho
    router.post('/', (req, res) => {
        const newCart = {
            id: `cart${cartsData.length + 1}`,
            products: [],
        };

        cartsData.push(newCart);
        io.emit('updateCarts', cartsData); 

        res.status(201).json(newCart);
    });

    // Buscar carrinho específico
    router.get('/:cid', async (req, res) => {
        const cartId = req.params.cid;
        const cart = await Cart.findById(cartId).populate('products');

        if (!cart) {
            res.status(404).json({ error: 'Carrinho não encontrado' });
        } else {
            res.render('cart', { cart });
        }
    });

    // Adicionar produto ao carrinho
    router.post('/:cid/product/:pid', async (req, res) => {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const cart = await Cart.findById(cartId);
        const product = await Product.findById(productId);

        if (!cart || !product) {
            res.status(404).json({ error: 'Carrinho ou produto não encontrado' });
        } else {
            cart.products.push(productId);
            await cart.save();
            io.emit('updateCarts', await Cart.find().populate('products')); 
            res.status(201).json(cart);
        }
    });

    // Atualizar carrinho com uma matriz de produtos
    router.put('/:cid', async (req, res) => {
        const cartId = req.params.cid;
        const products = req.body.products;

        const cart = await Cart.findById(cartId);
        if (!cart) {
            res.status(404).json({ error: 'Carrinho não encontrado' });
        } else {
            cart.products = products;
            await cart.save();
            io.emit('updateCarts', await Cart.find().populate('products'));
            res.json(cart);
        }
    });

    // Atualizar quantidade de produto no carrinho
    router.put('/:cid/products/:pid', async (req, res) => {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity;

        const cart = await Cart.findById(cartId);
        if (!cart) {
            res.status(404).json({ error: 'Carrinho não encontrado' });
        } else {
            const productIndex = cart.products.findIndex(p => p.equals(productId));
            if (productIndex === -1) {
                res.status(404).json({ error: 'Produto não encontrado no carrinho' });
            } else {
                cart.products[productIndex].quantity = quantity;
                await cart.save();
                io.emit('updateCarts', await Cart.find().populate('products'));
                res.json(cart);
            }
        }
    });

    // Remover todos os produtos do carrinho
    router.delete('/:cid', async (req, res) => {
        const cartId = req.params.cid;

        const cart = await Cart.findById(cartId);
        if (!cart) {
            res.status(404).json({ error: 'Carrinho não encontrado' });
        } else {
            cart.products = [];
            await cart.save();
            io.emit('updateCarts', await Cart.find().populate('products'));
            res.status(204).end();
        }
    });

    return router;
};
