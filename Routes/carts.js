const express = require('express');
const router = express.Router();

//dados de carrinhos
const cartsData = [
{ id: 'cart', products: [] },

];

// Rota para criar um novo carrinho
router.post('/', (req, res) => {

const newCart = {
    id: `cart${cartsData.length + 1}`,
    products: [],
};

// Adicione o novo carrinho aos dados existentes
cartsData.push(newCart);

res.status(201).json(newCart); 
});

// Rota para listar os produtos de um carrinho por ID
router.get('/:cid', (req, res) => {
const cartId = req.params.cid;
const cart = cartsData.find(c => c.id === cartId);

if (!cart) {
    res.status(404).json({ error: 'Carrinho não encontrado' });
} else {
    res.json(cart.products);
}
});

// Rota para adicionar um produto a um carrinho por ID
router.post('/:cid/product/:pid', (req, res) => {
const cartId = req.params.cid;
const productId = req.params.pid;

// Encontrar o carrinho pelo ID
const cart = cartsData.find(c => c.id === cartId);

if (!cart) {
    res.status(404).json({ error: 'Carrinho não encontrado' });
} else {
    cart.products.push(productId);
    res.status(201).json(cart); 
}
});

module.exports = router;
