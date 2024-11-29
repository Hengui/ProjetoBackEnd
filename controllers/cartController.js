const CartRepository = require('../repository/cartRepository');
const ProductRepository = require('../repository/productRepository');
const Ticket = require('../dao/models/ticket');

exports.getCart = async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await CartRepository.getCartById(cartId);
        if (!cart) {
            res.status(404).json({ error: 'Carrinho não encontrado' });
        } else {
            res.render('cart', { cart });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addProductToCart = async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const cart = await CartRepository.addProductToCart(cartId, productId);
        if (!cart) {
            res.status(404).json({ error: 'Carrinho ou produto não encontrado' });
        } else {
            io.emit('updateCarts', await CartRepository.getAllCarts());
            res.status(201).json(cart);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCart = async (req, res) => {
    const cartId = req.params.cid;
    const products = req.body.products;

    try {
        const cart = await CartRepository.updateCart(cartId, products);
        if (!cart) {
            res.status(404).json({ error: 'Carrinho não encontrado' });
        } else {
            io.emit('updateCarts', await CartRepository.getAllCarts());
            res.json(cart);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProductQuantity = async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;

    try {
        const cart = await CartRepository.updateProductQuantity(cartId, productId, quantity);
        if (!cart) {
            res.status(404).json({ error: 'Carrinho não encontrado' });
        } else {
            io.emit('updateCarts', await CartRepository.getAllCarts());
            res.json(cart);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.clearCart = async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await CartRepository.clearCart(cartId);
        if (!cart) {
            res.status(404).json({ error: 'Carrinho não encontrado' });
        } else {
            io.emit('updateCarts', await CartRepository.getAllCarts());
            res.status(204).end();
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.purchaseCart = async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await CartRepository.getCartById(cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Carrinho não encontrado' });
        }

        let totalAmount = 0;
        const failedProducts = [];

        for (const product of cart.products) {
            if (product.quantity > product.stock) {
                failedProducts.push(product._id);
            } else {
                product.stock -= product.quantity;
                totalAmount += product.price * product.quantity;
                await ProductRepository.updateProduct(product._id, product);
            }
        }

        const purchasedProducts = cart.products.filter(p => !failedProducts.includes(p._id));
        cart.products = failedProducts;
        await CartRepository.updateCart(cartId, failedProducts);

        const ticket = new Ticket({
            amount: totalAmount,
            purchaser: req.user.email
        });

        await ticket.save();

        res.status(200).json({ message: 'Compra realizada com sucesso', ticket });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
