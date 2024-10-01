const express = require('express');
const Product = require('../dao/models/product');
const router = express.Router();

module.exports = (io) => {
    router.get('/', async (req, res) => {
        const products = await Product.find();
        res.json(products);
    });

    router.get('/:pid', async (req, res) => {
        const product = await Product.findById(req.params.pid);
        if (!product) {
            res.status(404).json({ error: 'Produto não encontrado' });
        } else {
            res.json(product);
        }
    });

    router.post('/', async (req, res) => {
        const { title, price } = req.body;
        const newProduct = new Product({ title, price });
        await newProduct.save();
        io.emit('updateProducts', await Product.find());
        res.status(201).json(newProduct);
    });

    router.put('/:pid', async (req, res) => {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
        if (!updatedProduct) {
            res.status(404).json({ error: 'Produto não encontrado' });
        } else {
            io.emit('updateProducts', await Product.find());
            res.json(updatedProduct);
        }
    });

    router.delete('/:pid', async (req, res) => {
        const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
        if (!deletedProduct) {
            res.status(404).json({ error: 'Produto não encontrado' });
        } else {
            io.emit('updateProducts', await Product.find());
            res.status(204).end();
        }
    });

    return router;
};
