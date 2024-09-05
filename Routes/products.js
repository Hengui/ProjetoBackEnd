const express = require('express');
const router = express.Router();

const productsData = [
    { id: 1, title: 'Camisa', price: 99.90 },
];

router.get('/', (req, res) => {
    res.json(productsData);
});

module.exports = router;

// Rota para obter um produto por ID
router.get('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const product = productsData.find(p => p.id === productId);

    if (!product) {
        res.status(404).json({ error: 'Produto não encontrado' });
    } else {
        res.json(product);
    }
});

// Rota para adicionar um novo produto
router.post('/', (req, res) => {
    const { title, price } = req.body;

    const newProduct = {
        id: productsData.length + 1, 
        title,
        price,
    };

    productsData.push(newProduct);

    res.status(201).json(newProduct); 
});

// Rota para atualizar um produto por ID
router.put('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const updatedProduct = req.body; 

    const index = productsData.findIndex(p => p.id === productId);

    if (index === -1) {
        res.status(404).json({ error: 'Produto não encontrado' });
    } else {
        productsData[index] = { ...productsData[index], ...updatedProduct };
        res.json(productsData[index]);
    }
});

// routes/products.js
// ...

// Rota para deletar um produto por ID
router.delete('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);

    const index = productsData.findIndex(p => p.id === productId);

    if (index === -1) {
        res.status(404).json({ error: 'Produto não encontrado' });
    } else {
        productsData.splice(index, 1);
        res.status(204).end(); 
    }
});


