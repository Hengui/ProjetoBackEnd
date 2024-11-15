exports.getCart = async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await Cart.findById(cartId).populate('products');
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
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCart = async (req, res) => {
    const cartId = req.params.cid;
    const products = req.body.products;

    try {
        const cart = await Cart.findById(cartId);
        if (!cart) {
            res.status(404).json({ error: 'Carrinho não encontrado' });
        } else {
            cart.products = products;
            await cart.save();
            io.emit('updateCarts', await Cart.find().populate('products'));
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
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.clearCart = async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await Cart.findById(cartId);
        if (!cart) {
            res.status(404).json({ error: 'Carrinho não encontrado' });
        } else {
            cart.products = [];
            await cart.save();
            io.emit('updateCarts', await Cart.find().populate('products'));
            res.status(204).end();
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
