const express = require('express');
const router = express.Router();

const productsData = [
    { id: 1, title: 'Camisa', price: 99.90 },
];

module.exports = (io) => {
    router.get('/', (req, res) => {
        res.json(productsData);
    });

    router.get('/:pid', (req, res) => {
        const productId = parseInt(req.params.pid);
        const product = productsData.find(p => p.id === productId);

        if (!product) {
            res.status(404).json({ error: 'Produto não encontrado' });
        } else {
            res.json(product);
        }
    });

    router.post('/', (req, res) => {
        const { title, price } = req.body;

        const newProduct = {
            id: productsData.length + 1,
            title,
            price,
        };

        productsData.push(newProduct);
        io.emit('updateProducts', productsData); 

        res.status(201).json(newProduct);
    });

    router.put('/:pid', (req, res) => {
        const productId = parseInt(req.params.pid);
        const updatedProduct = req.body;

        const index = productsData.findIndex(p => p.id === productId);

        if (index === -1) {
            res.status(404).json({ error: 'Produto não encontrado' });
        } else {
            productsData[index] = { ...productsData[index], ...updatedProduct };
            io.emit('updateProducts', productsData); 
            res.json(productsData[index]);
        }
    });

    router.delete('/:pid', (req, res) => {
        const productId = parseInt(req.params.pid);

        const index = productsData.findIndex(p => p.id === productId);

        if (index === -1) {
            res.status(404).json({ error: 'Produto não encontrado' });
        } else {
            productsData.splice(index, 1);
            io.emit('updateProducts', productsData); 
            res.status(204).end();
        }
    });

    return router;
};
