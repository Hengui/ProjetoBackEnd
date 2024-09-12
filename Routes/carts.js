const express = require('express');
const router = express.Router();

const cartsData = [
    { id: 'cart1', products: [] },
];

module.exports = (io) => {
    router.post('/', (req, res) => {
        const newCart = {
            id: `cart${cartsData.length + 1}`,
            products: [],
        };

        cartsData.push(newCart);
        io.emit('updateCarts', cartsData); 

        res.status(201).json(newCart);
    });

    router.get('/:cid', (req, res) => {
        const cartId = req.params.cid;
        const cart = cartsData.find(c => c.id === cartId);

        if (!cart) {
            res.status(404).json({ error: 'Carrinho não encontrado' });
        } else {
            res.json(cart.products);
        }
    });

    router.post('/:cid/product/:pid', (req, res) => {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const cart = cartsData.find(c => c.id === cartId);

        if (!cart) {
            res.status(404).json({ error: 'Carrinho não encontrado' });
        } else {
            cart.products.push(productId);
            io.emit('updateCarts', cartsData); 
            res.status(201).json(cart);
        }
    });

    return router;
};
